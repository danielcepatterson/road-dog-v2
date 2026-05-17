# Band Manager Platform

A full-stack application for managing bands, booking shows, and storing relevant venue and logistics details in a centralized database.

## Features

### 🎵 Band Management
- User authentication with signup and login
- Band-specific show management
- Multi-user support within a band

### 📅 Show Calendar
- View all upcoming shows in a calendar interface
- Display shows sorted by date
- Quick access to venue and timing information

### 🎟️ Show Booking
Comprehensive show booking with the following details:

**Venue Information:**
- Venue Name
- Venue Address
- Event Date

**Point of Contact:**
- Contact Name
- Contact Phone
- Contact Email

**Show Times:**
- Load In Time
- Sound Check Time
- Doors Time
- Performance Time

**Logistics & Equipment:**
- Parking Details
- Backline Drums
- Backline Bass
- Sound Provided
- Additional Notes

### 📊 Show Details
- View complete show information in a detailed modal
- Edit and delete shows
- Contact information accessible directly (clickable phone and email)

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Hono** - Lightweight web framework
- **Cloudflare Workers** - Serverless computing
- **JWT** - Secure authentication
- **TypeScript** - Type-safe API development

### Deployment
- **Cloudflare Workers** - API and frontend hosting
- **Wrangler** - Cloudflare CLI tool

## Project Structure

```
src/
├── react-app/
│   ├── components/
│   │   ├── Auth.tsx          # Login/Signup forms
│   │   ├── Auth.css
│   │   ├── ShowForm.tsx       # Show booking form
│   │   ├── ShowForm.css
│   │   ├── ShowCalendar.tsx   # Calendar and details view
│   │   └── ShowCalendar.css
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── App.tsx                # Main application component
│   ├── App.css
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts
└── worker/
    ├── index.ts               # Hono server and API routes
    └── types.ts               # TypeScript type definitions
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` with the API running through Vite's proxy.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## API Endpoints

### Authentication

**POST `/api/auth/signup`**
```json
{
  "email": "band@example.com",
  "password": "secure_password",
  "bandName": "My Band"
}
```

**POST `/api/auth/login`**
```json
{
  "email": "band@example.com",
  "password": "secure_password"
}
```

### Show Management

**GET `/api/shows`** - Get all shows for the authenticated band
- Requires: JWT token in Authorization header

**POST `/api/shows`** - Create a new show
- Requires: JWT token
- Body: Complete show details

**GET `/api/shows/:id`** - Get specific show details
- Requires: JWT token

**PUT `/api/shows/:id`** - Update show details
- Requires: JWT token
- Body: Fields to update

**DELETE `/api/shows/:id`** - Delete a show
- Requires: JWT token

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in or signs up
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent in Authorization header for protected endpoints
5. Server validates token before accessing protected routes

## Database

Currently, the application uses in-memory storage for development. For production, consider:

- **Cloudflare D1** - SQLite database on Cloudflare Workers
- **Cloudflare KV** - Key-value storage for session management
- **PostgreSQL** - External database with REST API integration

## Security Notes

⚠️ **Development Mode:**
- JWT secret is hardcoded (`your-secret-key-change-in-production`)
- Passwords are stored in plaintext
- In-memory storage resets on server restart

**For Production:**
1. Use environment variables for JWT secret
2. Hash passwords with bcrypt or similar
3. Implement proper database with encryption
4. Use HTTPS only
5. Implement CORS properly
6. Add rate limiting
7. Add input validation and sanitization

## Future Enhancements

- [ ] Persistent database (D1 or KV storage)
- [ ] Password hashing
- [ ] Email notifications for shows
- [ ] Photo uploads for venues
- [ ] Equipment tracking and management
- [ ] Tour scheduling
- [ ] Income tracking
- [ ] Document storage (contracts, rider templates)
- [ ] Integration with calendar apps (Google Calendar, iCal)
- [ ] Mobile app
- [ ] Multi-band management for organizers
- [ ] Real-time collaboration features

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the repository.
