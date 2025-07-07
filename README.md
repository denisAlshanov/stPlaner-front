# stPlaner Frontend

A Vue.js 3 + Vuetify 3 web application for user authentication and management.

## Features

- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ JWT token management with automatic refresh
- ✅ User list display
- ✅ Responsive Material Design UI
- ✅ Form validation and error handling
- ✅ Route guards for authentication
- ✅ TypeScript support

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component library
- **TypeScript** - Type safety
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
src/
├── components/         # Reusable components
│   └── auth/          # Authentication components
├── views/             # Page components
│   ├── LoginView.vue  # Login page
│   └── UserListView.vue # User list page
├── stores/            # Pinia stores
│   └── auth.store.ts  # Authentication state
├── services/          # API services
│   ├── auth.service.ts # Authentication API
│   └── user.service.ts # User management API
├── router/            # Vue Router configuration
│   └── index.ts       # Routes and guards
├── utils/             # Utility functions
│   └── validators.ts  # Form validation
└── plugins/           # Vue plugins
    └── vuetify.ts     # Vuetify configuration
```

## Requirements

- **Node.js**: 18.x or higher (recommended: 20.x or 22.x)
- **npm**: 9.x or higher (comes with Node.js)

## Setup

1. **Check Node.js version**
   ```bash
   node --version
   # Should be 18.x or higher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript checks

## Authentication Flow

### Email/Password Login
1. User enters credentials
2. Form validation occurs
3. API call to `/api/v1/auth/login`
4. Tokens stored securely
5. Redirect to user list

### Google OAuth Login
1. User clicks Google button
2. Redirect to Google OAuth
3. After consent, callback to `/api/v1/auth/google/callback`
4. Tokens stored securely
5. Redirect to user list

## API Endpoints

The application integrates with these backend endpoints:

- `POST /api/v1/auth/login` - Email/password login
- `POST /api/v1/auth/google/login` - Google OAuth initiation
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/verify` - Token verification
- `GET /api/v1/users/list` - Get all users

## Security Features

- JWT tokens with automatic refresh
- Secure token storage (localStorage/sessionStorage)
- Route guards for protected pages
- Form validation and sanitization
- HTTPS-only API communication

## Browser Support

- Chrome 91+
- Firefox 90+
- Safari 14+
- Edge 91+
- Mobile browsers

## Development

The application follows Vue 3 Composition API patterns with TypeScript for type safety. It uses Pinia for state management and Vuetify for Material Design components.

### Key Components

- **LoginView** - Main login page with email/password and Google OAuth
- **UserListView** - Protected page showing all users
- **AuthStore** - Centralized authentication state management
- **AuthService** - API communication for authentication
- **UserService** - API communication for user management

### State Management

Authentication state is managed globally using Pinia:
- User information
- Authentication status
- Loading states
- Error handling

### Routing

Protected routes require authentication:
- `/login` - Login page (public)
- `/users` - User list (protected)
- `/` - Redirects to `/users`

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder using a web server

3. Configure your web server to:
   - Serve `index.html` for all routes (SPA mode)
   - Set proper HTTPS headers
   - Configure CORS if needed

## Contributing

1. Follow the existing code style
2. Add TypeScript types for all new code
3. Include proper error handling
4. Test all authentication flows
5. Ensure responsive design on mobile devices