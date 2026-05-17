# Production Deployment Guide

## Current State (Development)

The app currently uses:
- ✓ In-memory storage (resets on server restart)
- ✓ Hardcoded JWT secret
- ✓ Plaintext passwords
- ✓ No data persistence

## Moving to Production

### Step 1: Setup Cloudflare D1 Database

[Cloudflare D1](https://developers.cloudflare.com/d1/) is a serverless SQLite database perfect for Workers.

```bash
# Create a new D1 database
wrangler d1 create band-manager

# Update wrangler.json with the database binding
```

**Update `wrangler.json`:**
```json
{
  "env": {
    "production": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "band-manager",
          "database_id": "your-database-id"
        }
      ]
    }
  }
}
```

### Step 2: Create Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  band_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (band_id) REFERENCES bands(id)
);

-- Bands table
CREATE TABLE bands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shows table
CREATE TABLE shows (
  id TEXT PRIMARY KEY,
  band_id TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  load_in_time TEXT NOT NULL,
  sound_check_time TEXT NOT NULL,
  doors_time TEXT NOT NULL,
  performance_time TEXT NOT NULL,
  parking_details TEXT,
  backline_drums TEXT,
  backline_bass TEXT,
  sound_provided TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (band_id) REFERENCES bands(id)
);

-- Create indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_band ON users(band_id);
CREATE INDEX idx_shows_band ON shows(band_id);
CREATE INDEX idx_shows_date ON shows(event_date);
```

### Step 3: Update Worker Code

Replace in-memory storage with D1:

```typescript
// src/worker/index.ts
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import type { Show, User } from "./types";

const app = new Hono<{ Bindings: Env & { DB: D1Database } }>();

const JWT_SECRET = "your-secret-key"; // Use environment variable

// Auth Signup
app.post("/api/auth/signup", async (c) => {
  const { email, password, bandName } = await c.req.json();
  const db = c.env.DB;

  // Hash password (use bcrypt in production)
  const hashedPassword = await hashPassword(password);
  
  const userId = uuidv4();
  const bandId = uuidv4();

  try {
    // Create band
    await db
      .prepare("INSERT INTO bands (id, name) VALUES (?, ?)")
      .bind(bandId, bandName || "My Band")
      .run();

    // Create user
    await db
      .prepare(
        "INSERT INTO users (id, email, password_hash, band_id) VALUES (?, ?, ?, ?)"
      )
      .bind(userId, email, hashedPassword, bandId)
      .run();

    const token = await jwt.sign({ id: userId, email }, JWT_SECRET);

    return c.json(
      {
        token,
        user: { id: userId, email, bandId },
      },
      201
    );
  } catch (error) {
    return c.json({ error: "Signup failed" }, 400);
  }
});

// Get Shows
app.get("/api/shows", async (c) => {
  const payload = c.get("jwtPayload");
  const db = c.env.DB;

  try {
    // Get user's band
    const user = await db
      .prepare("SELECT band_id FROM users WHERE id = ?")
      .bind(payload.id)
      .first();

    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    // Get shows
    const shows = await db
      .prepare("SELECT * FROM shows WHERE band_id = ? ORDER BY event_date ASC")
      .bind(user.band_id)
      .all();

    return c.json(shows.results);
  } catch (error) {
    return c.json({ error: "Failed to fetch shows" }, 500);
  }
});

// Create Show
app.post("/api/shows", async (c) => {
  const payload = c.get("jwtPayload");
  const db = c.env.DB;
  const showData = await c.req.json();

  try {
    // Get user's band
    const user = await db
      .prepare("SELECT band_id FROM users WHERE id = ?")
      .bind(payload.id)
      .first();

    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    const showId = uuidv4();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO shows (
          id, band_id, venue_name, venue_address, event_date,
          contact_name, contact_phone, contact_email,
          load_in_time, sound_check_time, doors_time, performance_time,
          parking_details, backline_drums, backline_bass, sound_provided,
          notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        showId,
        user.band_id,
        showData.venueName,
        showData.venueAddress,
        showData.eventDate,
        showData.contactName,
        showData.contactPhone,
        showData.contactEmail,
        showData.loadInTime,
        showData.soundCheckTime,
        showData.doorsTime,
        showData.performanceTime,
        showData.parkingDetails,
        showData.backlineDrums,
        showData.backlineBass,
        showData.soundProvided,
        showData.notes || null,
        now,
        now
      )
      .run();

    return c.json({ id: showId, ...showData }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create show" }, 500);
  }
});

// Similar patterns for update and delete...
```

### Step 4: Environment Variables

**Update `.env.production`:**
```
JWT_SECRET=your-very-secure-jwt-secret-key
BCRYPT_ROUNDS=10
```

### Step 5: Password Hashing

Install bcrypt:
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

Usage:
```typescript
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Step 6: CORS Configuration

```typescript
import { cors } from 'hono/cors';

app.use(
  '*',
  cors({
    origin: 'https://yourdomain.com',
    credentials: true,
    maxAge: 3600,
  })
);
```

### Step 7: Rate Limiting

```bash
npm install hono-rate-limit
```

```typescript
import { rateLimit } from 'hono-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.post('/api/auth/login', limiter, ...);
app.post('/api/auth/signup', limiter, ...);
```

### Step 8: Input Validation

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  bandName: z.string().optional(),
});

app.post("/api/auth/signup", async (c) => {
  const body = await c.req.json();
  const result = signupSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: "Invalid input" }, 400);
  }
  
  // ... rest of handler
});
```

### Step 9: Logging and Monitoring

```typescript
// Add logging middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  console.log(`${c.req.method} ${c.req.path} - ${c.res.status} (${duration}ms)`);
});
```

### Step 10: Deploy

```bash
# Build
npm run build

# Deploy to Cloudflare Workers
wrangler publish --env production
```

## Security Checklist

- [ ] JWT secret stored in environment variables (not hardcoded)
- [ ] Passwords hashed with bcrypt (never store plaintext)
- [ ] HTTPS enforced (Cloudflare handles this)
- [ ] CORS configured for your domain only
- [ ] Rate limiting enabled on auth endpoints
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] CSRF tokens for state-changing operations
- [ ] Secrets never logged or exposed
- [ ] Database backups configured
- [ ] Monitoring and alerts enabled

## Performance Optimization

1. **Caching:**
   ```typescript
   c.header('Cache-Control', 'public, max-age=3600');
   ```

2. **Database Indexes:** Already created in schema

3. **Pagination:**
   ```typescript
   const limit = Math.min(parseInt(c.query('limit')) || 50, 100);
   const offset = parseInt(c.query('offset')) || 0;
   
   const shows = await db
     .prepare('SELECT * FROM shows WHERE band_id = ? LIMIT ? OFFSET ?')
     .bind(bandId, limit, offset)
     .all();
   ```

## Monitoring

Set up monitoring with:
- Cloudflare Analytics Dashboard
- Sentry for error tracking
- LogRocket for session replay

## Backup Strategy

D1 databases are automatically backed up by Cloudflare, but implement:
- Daily exports to external storage
- Point-in-time recovery plan
- Disaster recovery procedures

## Migration from Development

1. Export development data (if needed)
2. Run migrations on production database
3. Test thoroughly before full deployment
4. Have rollback plan ready
5. Monitor closely after deployment

---

**Questions?** Check [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
