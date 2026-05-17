# Band Manager - Quick Start Guide

## What You've Built

A complete band management platform where band members can:
- ✅ Sign up and log in securely
- ✅ View a calendar of all upcoming shows
- ✅ Book new shows with comprehensive venue and logistics details
- ✅ View detailed show information including contact details and equipment needs
- ✅ Delete shows they no longer need

## First Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Testing the App

### Create a Test Account
1. Click "Sign Up"
2. Enter an email and password
3. Optionally create a new band or join an existing one
4. Click "Sign Up"

### Book Your First Show
1. Click "Book a Show"
2. Fill in venue details:
   - **Venue Name:** "The Fillmore"
   - **Venue Address:** "1805 Geary Blvd, San Francisco, CA"
   - **Event Date:** Select a date
3. Add contact info:
   - **Name:** "John Doe"
   - **Phone:** "555-0123"
   - **Email:** "john@venue.com"
4. Set times:
   - **Load In:** 18:00
   - **Sound Check:** 18:30
   - **Doors:** 19:00
   - **Performance:** 20:00
5. Add logistics:
   - **Parking:** "Street parking available"
   - **Backline:** Fill in as needed
   - **Sound:** "House system included"
6. Click "Create Show"

### View Your Shows
- Your shows appear on the calendar
- Click any show to see full details
- Click the phone number or email to contact the venue

## Key Components

### Auth System
- **File:** `src/react-app/contexts/AuthContext.tsx`
- Manages login/signup and session storage
- Uses JWT tokens for API requests

### Show Calendar
- **File:** `src/react-app/components/ShowCalendar.tsx`
- Displays all upcoming shows sorted by date
- Shows modal with full details on click

### Show Booking Form
- **File:** `src/react-app/components/ShowForm.tsx`
- Organized into logical sections
- All required fields for venue management

### API Backend
- **File:** `src/worker/index.ts`
- RESTful endpoints for shows
- JWT authentication middleware

## Development Tips

### Making Changes
1. Edit component files in `src/react-app/`
2. Save and see changes live (Hot Module Replacement)
3. Check browser console for errors
4. Vite dev server is configured in `vite.config.ts`

### API Testing
Test endpoints using curl or Postman:

```bash
# Sign up
curl -X POST http://localhost:5173/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get shows (replace TOKEN with actual JWT)
curl -X GET http://localhost:5173/api/shows \
  -H "Authorization: Bearer TOKEN"
```

### Styling
- Global styles: `src/react-app/App.css`
- Component styles: `src/react-app/components/*.css`
- Color scheme uses CSS variables in `:root`

## Next Steps

### For Development
1. Replace in-memory storage with Cloudflare D1 database
2. Add password hashing for security
3. Add form validation
4. Add error handling improvements
5. Deploy to Cloudflare Workers

### For Production
```bash
npm run check    # Verify build
npm run build    # Build for production
npm run deploy   # Deploy to Cloudflare
```

## Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API errors
- Check browser DevTools Network tab
- Look at worker console for errors
- Ensure JWT_SECRET matches between auth endpoints

### Styling issues
- Check if CSS files are imported in components
- Verify class names match between TSX and CSS
- Clear browser cache (Ctrl+Shift+Delete)

## File Guide

| File | Purpose |
|------|---------|
| `src/react-app/App.tsx` | Main app component, routing logic |
| `src/react-app/contexts/AuthContext.tsx` | Authentication state & hooks |
| `src/react-app/components/Auth.tsx` | Login/Signup forms |
| `src/react-app/components/ShowForm.tsx` | Show booking form |
| `src/react-app/components/ShowCalendar.tsx` | Calendar & details view |
| `src/worker/index.ts` | API endpoints |
| `src/worker/types.ts` | TypeScript interfaces |
| `package.json` | Dependencies & scripts |
| `vite.config.ts` | Vite configuration |
| `wrangler.json` | Cloudflare Worker config |

## Key Features Implemented

✅ User authentication with signup/login
✅ Band-specific data isolation
✅ Comprehensive show management
✅ Beautiful, responsive UI
✅ Form validation
✅ Error handling
✅ JWT-based API security
✅ LocalStorage for session persistence

## What's Next?

The platform is ready for:
1. **Database Integration** - Connect to Cloudflare D1 or your preferred database
2. **Security Hardening** - Add password hashing, input validation
3. **Feature Expansion** - Email notifications, photo uploads, exports
4. **Deployment** - Deploy to Cloudflare Workers for global availability

Happy booking! 🎸
