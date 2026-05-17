# API Reference

Complete documentation for the Band Manager API endpoints.

## Base URL

**Development:** `http://localhost:5173/api`
**Production:** `https://yourdomain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the login/signup endpoints.

---

## Authentication Endpoints

### Sign Up

Create a new user account.

```
POST /auth/signup
Content-Type: application/json

{
  "email": "band@example.com",
  "password": "securePassword123",
  "bandName": "My Awesome Band"
}
```

**Parameters:**
- `email` (string, required) - User's email address
- `password` (string, required) - User's password (min 6 chars in dev, should be enforced in prod)
- `bandName` (string, optional) - Name of band to create. If omitted, user joins a default band

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "band@example.com",
    "bandId": "650e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Status Codes:**
- `201 Created` - Account created successfully
- `400 Bad Request` - User already exists or invalid input
- `500 Internal Server Error` - Server error

---

### Log In

Authenticate an existing user.

```
POST /auth/login
Content-Type: application/json

{
  "email": "band@example.com",
  "password": "securePassword123"
}
```

**Parameters:**
- `email` (string, required) - User's email
- `password` (string, required) - User's password

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "band@example.com",
    "bandId": "650e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

## Show Management Endpoints

### Get All Shows

Retrieve all shows for the authenticated user's band.

```
GET /shows
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "bandId": "650e8400-e29b-41d4-a716-446655440001",
    "venueName": "The Fillmore",
    "venueAddress": "1805 Geary Blvd, San Francisco, CA",
    "eventDate": "2026-06-15T19:00:00Z",
    "contactName": "John Doe",
    "contactPhone": "555-0123",
    "contactEmail": "john@fillmore.com",
    "loadInTime": "18:00",
    "soundCheckTime": "18:30",
    "doorsTime": "19:00",
    "performanceTime": "20:00",
    "parkingDetails": "Street parking available on Geary",
    "backlineDrums": "Drums provided by venue",
    "backlineBass": "Bass amp provided, bring your own bass",
    "soundProvided": "Full house system, soundcheck 30 minutes before doors",
    "notes": "Have ID ready, early arrival expected",
    "createdAt": "2026-05-17T10:30:00Z",
    "updatedAt": "2026-05-17T10:30:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Shows retrieved successfully
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

---

### Get Single Show

Retrieve details for a specific show.

```
GET /shows/:id
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string) - Show ID

**Response:** Single show object (see structure above)

**Status Codes:**
- `200 OK` - Show retrieved
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Show doesn't exist or unauthorized access
- `500 Internal Server Error` - Server error

---

### Create Show

Book a new show.

```
POST /shows
Authorization: Bearer <token>
Content-Type: application/json

{
  "venueName": "The Fillmore",
  "venueAddress": "1805 Geary Blvd, San Francisco, CA",
  "eventDate": "2026-06-15T19:00:00Z",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "contactEmail": "john@fillmore.com",
  "loadInTime": "18:00",
  "soundCheckTime": "18:30",
  "doorsTime": "19:00",
  "performanceTime": "20:00",
  "parkingDetails": "Street parking available",
  "backlineDrums": "Provided by venue",
  "backlineBass": "Bring your own",
  "soundProvided": "Full house system",
  "notes": "Early arrival requested"
}
```

**Parameters:**
- `venueName` (string, required) - Name of the venue
- `venueAddress` (string, required) - Full address of venue
- `eventDate` (string, required) - ISO 8601 datetime of event
- `contactName` (string, required) - Primary contact person's name
- `contactPhone` (string, required) - Contact phone number
- `contactEmail` (string, required) - Contact email address
- `loadInTime` (string, required) - Load in time (HH:MM format)
- `soundCheckTime` (string, required) - Sound check time (HH:MM format)
- `doorsTime` (string, required) - Doors open time (HH:MM format)
- `performanceTime` (string, required) - Performance start time (HH:MM format)
- `parkingDetails` (string, required) - Parking information
- `backlineDrums` (string, required) - Drum kit availability
- `backlineBass` (string, required) - Bass amplifier/equipment availability
- `soundProvided` (string, required) - Sound system details
- `notes` (string, optional) - Additional notes

**Response:**
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "bandId": "650e8400-e29b-41d4-a716-446655440001",
  "venueName": "The Fillmore",
  "venueAddress": "1805 Geary Blvd, San Francisco, CA",
  "eventDate": "2026-06-15T19:00:00Z",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "contactEmail": "john@fillmore.com",
  "loadInTime": "18:00",
  "soundCheckTime": "18:30",
  "doorsTime": "19:00",
  "performanceTime": "20:00",
  "parkingDetails": "Street parking available",
  "backlineDrums": "Provided by venue",
  "backlineBass": "Bring your own",
  "soundProvided": "Full house system",
  "notes": "Early arrival requested",
  "createdAt": "2026-05-17T10:35:00Z",
  "updatedAt": "2026-05-17T10:35:00Z"
}
```

**Status Codes:**
- `201 Created` - Show created successfully
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

---

### Update Show

Update details for an existing show.

```
PUT /shows/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "performanceTime": "21:00",
  "notes": "Updated performance time"
}
```

**URL Parameters:**
- `id` (string) - Show ID

**Request Body:**
Any of the show fields can be updated. Only include fields you want to change.

**Response:** Updated show object

**Status Codes:**
- `200 OK` - Show updated successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Show doesn't exist or unauthorized access
- `500 Internal Server Error` - Server error

---

### Delete Show

Cancel/delete a show.

```
DELETE /shows/:id
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string) - Show ID

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200 OK` - Show deleted successfully
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Show doesn't exist or unauthorized access
- `500 Internal Server Error` - Server error

---

## Error Handling

The API returns standard HTTP status codes. Error responses include a message:

```json
{
  "error": "Description of the error"
}
```

**Common Errors:**

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "Invalid input" | Missing required fields or invalid format |
| 401 | "Invalid credentials" | Wrong email/password |
| 401 | "User not found" | Token is invalid or user was deleted |
| 404 | "Show not found" | Show doesn't exist or access denied |
| 500 | "Server error" | Unexpected server error |

---

## Rate Limiting

(Currently not enforced in development, but recommended for production)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1684320000
```

---

## Examples

### Complete Signup and Create Show Flow

**1. Sign up:**
```bash
curl -X POST http://localhost:5173/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "myband@example.com",
    "password": "MySecurePassword123",
    "bandName": "My Amazing Band"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "myband@example.com",
    "bandId": "650e8400-e29b-41d4-a716-446655440001"
  }
}
```

**2. Create a show:**
```bash
curl -X POST http://localhost:5173/api/shows \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "venueName": "The Fillmore",
    "venueAddress": "1805 Geary Blvd, San Francisco, CA",
    "eventDate": "2026-06-15T19:00:00Z",
    "contactName": "Jane Smith",
    "contactPhone": "415-555-1234",
    "contactEmail": "jane@fillmore.com",
    "loadInTime": "18:00",
    "soundCheckTime": "18:30",
    "doorsTime": "19:00",
    "performanceTime": "20:00",
    "parkingDetails": "Lot available across street",
    "backlineDrums": "Venue has drums",
    "backlineBass": "Bring your own bass",
    "soundProvided": "Full PA system included",
    "notes": "Contact Jane 24 hours before"
  }'
```

**3. Get all shows:**
```bash
curl -X GET http://localhost:5173/api/shows \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Band Manager API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Sign Up",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/signup",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"band@example.com\", \"password\": \"test123\", \"bandName\": \"My Band\"}"
        }
      }
    },
    {
      "name": "Log In",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"band@example.com\", \"password\": \"test123\"}"
        }
      }
    }
  ]
}
```

---

**Version:** 1.0.0
**Last Updated:** May 17, 2026
