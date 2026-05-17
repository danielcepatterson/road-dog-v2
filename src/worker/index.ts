import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import type { Show, User, AuthPayload, AuthResponse } from "./types";

const app = new Hono<{ Bindings: Env }>();

// In-memory storage (for development - replace with D1/KV in production)
// In production, use Cloudflare D1 (SQLite) or KV storage
const users = new Map<string, User>();
const shows = new Map<string, Show>();
const bands = new Map<string, { id: string; name: string }>();

// Initialize with test data
const testBandId = uuidv4();
bands.set(testBandId, { id: testBandId, name: "Test Band" });

// JWT secret (use environment variable in production)
const JWT_SECRET = "your-secret-key-change-in-production";

// Auth endpoints
app.post("/api/auth/signup", async (c) => {
  const body = (await c.req.json()) as {
    email: string;
    password: string;
    bandName?: string;
  };

  if (users.has(body.email)) {
    return c.json({ error: "User already exists" }, 400);
  }

  const userId = uuidv4();
  const bandId = body.bandName ? uuidv4() : testBandId;

  if (body.bandName) {
    bands.set(bandId, { id: bandId, name: body.bandName });
  }

  const user: User = {
    id: userId,
    email: body.email,
    password: body.password, // In production, hash this!
    bandId,
    createdAt: new Date(),
  };

  users.set(body.email, user);

  const token = await sign({ id: user.id, email: user.email }, JWT_SECRET);

  return c.json(
    {
      token,
      user: {
        id: user.id,
        email: user.email,
        bandId: user.bandId,
      },
    } as AuthResponse,
    201
  );
});

app.post("/api/auth/login", async (c) => {
  const body = (await c.req.json()) as AuthPayload;

  const user = users.get(body.email);
  if (!user || user.password !== body.password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await sign({ id: user.id, email: user.email }, JWT_SECRET);

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      bandId: user.bandId,
    },
  } as AuthResponse);
});

// Middleware to verify JWT
app.use(
  "/api/shows/*",
  jwt({
    secret: JWT_SECRET,
  })
);

// Show Management endpoints
app.get("/api/shows", (c) => {
  const payload = c.get("jwtPayload");
  const userEmail = payload.email;
  const user = users.get(userEmail);

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const bandShows = Array.from(shows.values()).filter(
    (show) => show.bandId === user.bandId
  );
  return c.json(bandShows);
});

app.post("/api/shows", async (c) => {
  const payload = c.get("jwtPayload");
  const userEmail = payload.email;
  const user = users.get(userEmail);

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const body = (await c.req.json()) as Omit<Show, "id" | "createdAt" | "updatedAt">;

  const show: Show = {
    ...body,
    id: uuidv4(),
    bandId: user.bandId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  shows.set(show.id, show);

  return c.json(show, 201);
});

app.get("/api/shows/:id", (c) => {
  const payload = c.get("jwtPayload");
  const userEmail = payload.email;
  const user = users.get(userEmail);

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const show = shows.get(c.req.param("id"));

  if (!show || show.bandId !== user.bandId) {
    return c.json({ error: "Show not found" }, 404);
  }

  return c.json(show);
});

app.put("/api/shows/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const userEmail = payload.email;
  const user = users.get(userEmail);

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const show = shows.get(c.req.param("id"));

  if (!show || show.bandId !== user.bandId) {
    return c.json({ error: "Show not found" }, 404);
  }

  const body = (await c.req.json()) as Partial<Show>;

  const updatedShow: Show = {
    ...show,
    ...body,
    id: show.id,
    bandId: show.bandId,
    createdAt: show.createdAt,
    updatedAt: new Date(),
  };

  shows.set(show.id, updatedShow);

  return c.json(updatedShow);
});

app.delete("/api/shows/:id", (c) => {
  const payload = c.get("jwtPayload");
  const userEmail = payload.email;
  const user = users.get(userEmail);

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const show = shows.get(c.req.param("id"));

  if (!show || show.bandId !== user.bandId) {
    return c.json({ error: "Show not found" }, 404);
  }

  shows.delete(c.req.param("id"));

  return c.json({ success: true });
});

// Test endpoint
app.get("/api/", (c) => c.json({ message: "Band Management API" }));

export default app;
