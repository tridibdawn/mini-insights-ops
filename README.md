# Mini InsightOps

A full-stack web application for exploring and managing insight events with role-based access control, interactive maps, and data visualization.

## Features

- **Authentication & RBAC**: Secure login system with three role types (Admin, Analyst, Viewer)
- **Interactive Map View**: Visualize events on an interactive map with filtering and clustering
- **Dashboard**: Real-time analytics with charts showing event trends and insights
- **Event Management**: Full CRUD operations for insight events with advanced filtering
- **User Management**: Admin interface to manage user roles and permissions
- **Responsive Design**: Modern, clean UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Data Storage**: In-memory (with 32+ seeded events)
- **Maps**: Mapbox GL JS with OpenStreetMap fallback
- **Charts**: Recharts
- **Authentication**: JWT with HTTP-only cookies

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or extract the repository:
```bash
cd mini-insights-ops
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

You'll be redirected to the login page automatically.

### Test Accounts

Use these accounts to test different permission levels:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@test.com | password | Admin | Full access - create, edit, delete events and manage users |
| analyst@test.com | password | Analyst | View all data, create and edit events |
| viewer@test.com | password | Viewer | Read-only access to all data |

## Project Structure

```
mini-insights-ops/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── events/        # Event CRUD endpoints
│   │   └── users/         # User management endpoints
│   ├── dashboard/         # Dashboard page
│   ├── events/            # Event list and detail pages
│   ├── login/             # Login page
│   ├── map/               # Interactive map view
│   └── users/             # User management (admin only)
├── components/
│   ├── layout/            # Layout components (Header)
│   └── ui/                # Reusable UI components (Button, Input)
├── lib/
│   ├── context/           # React context (Auth)
│   ├── data/              # Data layer (users, events)
│   ├── auth.ts            # Authentication utilities
│   ├── middleware.ts      # API middleware
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List events with filtering (query params: category, severity, minScore, search, startDate, endDate, tags)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (Admin/Analyst only)
- `PUT /api/events/:id` - Update event (Admin/Analyst only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `GET /api/events/stats` - Get dashboard statistics

### Users
- `GET /api/users` - List users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This application can be deployed to:
- **Vercel**: Recommended (zero-config deployment)
- **Netlify**: Supports Next.js
- Any Node.js hosting platform

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with default settings

## Key Features Implementation

### Role-Based Access Control (RBAC)
- Backend middleware enforces permissions on all API routes
- Frontend conditionally renders UI elements based on user role
- Three permission levels: read, create/edit, delete, manage users

### Map View
- OpenStreetMap integration (no API key required)
- Custom markers colored by severity
- Real-time filtering by category, severity, score, and date range
- Search functionality
- Side panel with detailed event information

### Dashboard
- Total events count with severity breakdown
- Events by category (bar chart)
- Events by severity (pie chart)
- 14-day trend line chart
- AI-generated insights with trend indicators

### Event Table
- Sortable columns (title, severity, score, created date)
- Pagination (10 items per page)
- Advanced filtering
- Search across title, description, and tags

## Tradeoffs & Shortcuts

### Data Storage
**Chosen**: In-memory storage
**Why**: Faster development, no database setup required
**Production Alternative**: PostgreSQL or SQLite with Prisma ORM

### Map Implementation
**Chosen**: OpenStreetMap tiles (no API key)
**Why**: Works out of the box, no external dependencies
**Production Alternative**: Mapbox or Google Maps with proper API keys for better performance and features

### Authentication
**Chosen**: Simple JWT with bcrypt
**Why**: Sufficient for prototype, demonstrates RBAC implementation
**Production Alternative**: NextAuth.js or Auth0 with OAuth providers

### State Management
**Chosen**: React Context for auth, local state for UI
**Why**: Simple, appropriate for app size
**Production Alternative**: Redux Toolkit or Zustand for complex state

## Environment Variables

Optional environment variables:

```env
JWT_SECRET=your-secret-key-here  # Default provided for demo
NODE_ENV=production               # Set for production builds
```

## Security Notes

⚠️ **Important for Production**:
1. Change the default JWT_SECRET
2. Use HTTPS in production
3. Implement rate limiting on API endpoints
4. Add CSRF protection
5. Use a proper database with connection pooling
6. Implement proper password reset flow
7. Add audit logging for sensitive operations

## License

MIT - This is a prototype/demo application.

## Support

For questions or issues, please refer to the code comments or contact the developer.
