# Login Feature - Product Requirements Document

## 1. Overview

The login feature is the entry point to the stPlaner application, providing secure authentication through multiple methods including traditional email/password and Google OAuth.

## 2. User Stories

### 2.1 Primary User Stories
1. **As a user**, I want to log in with my email and password so that I can access my account
2. **As a user**, I want to log in with Google so that I can quickly access the app without creating a new password
3. **As a user**, I want to see clear error messages when login fails so that I know what went wrong
4. **As a user**, I want my session to persist so that I don't have to log in every time

### 2.2 Technical User Stories
1. **As a developer**, I want secure token storage so that user sessions are protected
2. **As a developer**, I want automatic token refresh so that users don't experience unexpected logouts

## 3. Functional Requirements

### 3.1 Login Page UI

#### 3.1.1 Layout Structure
```
┌─────────────────────────────────────┐
│          stPlaner Logo              │
│                                     │
│    ┌───────────────────────┐       │
│    │   Welcome Back!        │       │
│    │                        │       │
│    │  [Email Input Field]   │       │
│    │                        │       │
│    │  [Password Input]      │       │
│    │                        │       │
│    │  [x] Remember me       │       │
│    │                        │       │
│    │  [Login Button]        │       │
│    │                        │       │
│    │  ──── OR ────         │       │
│    │                        │       │
│    │  [Sign in with Google]│       │
│    └───────────────────────┘       │
│                                     │
│         Forgot Password?            │
└─────────────────────────────────────┘
```

#### 3.1.2 Components Breakdown

**App Logo/Title**
- Positioned at top center
- Should be clickable (returns to login if already there)

**Login Card**
- Centered on page
- Maximum width: 400px
- Elevation: 4 (Vuetify)
- Padding: 32px

**Email Input**
- Label: "Email"
- Type: email
- Required field
- Validation: Valid email format
- Icon: mdi-email

**Password Input**
- Label: "Password"
- Type: password
- Required field
- Minimum length: 6 characters
- Toggle visibility button
- Icon: mdi-lock

**Remember Me Checkbox**
- Optional
- Default: unchecked
- Stores token in localStorage when checked

**Login Button**
- Full width
- Primary color
- Loading state during authentication
- Disabled when form is invalid

**Google OAuth Button**
- Full width
- Google brand colors
- Google logo icon
- Text: "Sign in with Google"

### 3.2 Authentication Flow

#### 3.2.1 Email/Password Login Flow
1. User enters credentials
2. Form validation occurs on blur and submit
3. On submit:
   - Show loading state
   - Call `POST /api/v1/auth/login`
   - On success:
     - Store tokens (access & refresh)
     - Update auth store
     - Redirect to user list
   - On failure:
     - Show error message
     - Clear password field
     - Focus email field

#### 3.2.2 Google OAuth Flow
1. User clicks Google button
2. Redirect to Google OAuth consent page
3. After consent:
   - Google redirects to callback URL
   - App exchanges code for tokens
   - Store tokens
   - Redirect to user list

### 3.3 Error Handling

#### Error Types & Messages
| Error Code | User Message |
|------------|--------------|
| 401 | "Invalid email or password" |
| 404 | "Account not found" |
| 429 | "Too many attempts. Please try again later" |
| 500 | "Something went wrong. Please try again" |
| Network | "Connection error. Please check your internet" |

### 3.4 Form Validation

#### Email Field
- Required
- Must be valid email format
- Real-time validation on blur
- Error: "Please enter a valid email"

#### Password Field
- Required
- Minimum 6 characters
- Real-time validation on blur
- Error: "Password must be at least 6 characters"

## 4. Technical Requirements

### 4.1 API Integration

#### Login Endpoint
```typescript
POST /api/v1/auth/login
Request Body: {
  email: string,
  password: string
}
Response: {
  access_token: string,
  refresh_token: string,
  user: {
    id: string,
    email: string,
    name?: string
  }
}
```

#### Google OAuth Endpoints
```typescript
// Initiate OAuth
POST /api/v1/auth/google/login
Response: {
  auth_url: string
}

// Handle callback
GET /api/v1/auth/google/callback?code={code}
Response: {
  access_token: string,
  refresh_token: string,
  user: {...}
}
```

### 4.2 Token Management

#### Storage Strategy
- Access Token: In-memory (Pinia store)
- Refresh Token: 
  - sessionStorage (default)
  - localStorage (if "Remember me" checked)

#### Token Refresh Logic
- Check token expiry before each API call
- If expired, call refresh endpoint
- Update stored tokens
- Retry original request

### 4.3 Security Requirements

1. **HTTPS Only**: All API calls must use HTTPS
2. **CSRF Protection**: Include CSRF token if required by backend
3. **XSS Prevention**: Sanitize all user inputs
4. **Secure Storage**: Never store sensitive data in plain text

## 5. Component Structure

```
src/
├── views/
│   └── LoginView.vue
├── components/
│   └── auth/
│       ├── LoginForm.vue
│       └── GoogleLoginButton.vue
├── services/
│   └── auth.service.ts
├── stores/
│   └── auth.store.ts
├── router/
│   └── guards/
│       └── auth.guard.ts
└── utils/
    └── validators.ts
```

## 6. State Management (Pinia)

### Auth Store State
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

### Actions
- `login(credentials: LoginCredentials)`
- `loginWithGoogle()`
- `logout()`
- `refreshToken()`
- `checkAuth()`

## 7. Routing

### Routes
```typescript
{
  path: '/login',
  name: 'Login',
  component: LoginView,
  meta: { requiresAuth: false }
}
```

### Navigation Guard
- Redirect to login if not authenticated
- Redirect from login to user list if already authenticated

## 8. Responsive Design

### Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

### Mobile Adaptations
- Full-width login card with 16px margin
- Stack form elements vertically
- Larger touch targets (48px minimum)

## 9. Accessibility

1. **Keyboard Navigation**: Full keyboard support
2. **Screen Readers**: Proper ARIA labels
3. **Color Contrast**: WCAG AA compliant
4. **Focus Indicators**: Visible focus states
5. **Error Announcements**: Live regions for errors

## 10. Performance

1. **Bundle Size**: < 50KB for login chunk
2. **Load Time**: < 2s on 3G
3. **Interaction**: Immediate feedback on all actions
4. **Validation**: Debounced (300ms) for real-time checks

## 11. Testing Requirements

### Unit Tests
- Form validation logic
- Auth service methods
- Store actions and mutations

### Integration Tests
- Complete login flow
- Error handling scenarios
- Token refresh mechanism

### E2E Tests
- User can log in with valid credentials
- User sees errors with invalid credentials
- Google OAuth flow (mock)

## 12. Success Metrics

1. **Login Success Rate**: > 95%
2. **Time to Login**: < 10 seconds average
3. **Form Abandonment**: < 20%
4. **Error Recovery**: 90% retry after error