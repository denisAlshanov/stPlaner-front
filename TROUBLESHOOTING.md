# Troubleshooting Guide

## Login Form Not Showing

If you don't see the login form on the page, try these troubleshooting steps:

### 1. Check Browser Console
Open browser developer tools (F12) and check the Console tab for errors:

```bash
# Common errors to look for:
- Vuetify component registration errors
- Router navigation errors
- Authentication store errors
- Import/module errors
```

### 2. Verify Application is Running
Make sure the development server is running:

```bash
npm run dev
```

You should see:
```
VITE v7.0.2  ready in xxxx ms
➜  Local:   http://localhost:3000/
```

### 3. Check Browser Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for any failed requests (red status codes)

### 4. Verify You're on the Login Page
Make sure you're visiting the correct URL:
- `http://localhost:3000/login` (direct login page)
- `http://localhost:3000/` (should redirect to login if not authenticated)

### 5. Clear Browser Cache
Sometimes cached files can cause issues:
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 6. Check Environment Variables
Verify your `.env` file exists and has the correct API URL:

```bash
# .env file should contain:
VITE_API_BASE_URL=http://localhost:8000
```

### 7. Restart Development Server
Stop the server (Ctrl+C) and restart:

```bash
npm run dev
```

### 8. Test with Debug Mode
If the form still doesn't show, you can test if the routing is working by temporarily adding debug info to the login page.

Add this to the top of `src/views/LoginView.vue` template:

```vue
<template>
  <div>
    <!-- Debug info -->
    <div style="background: yellow; padding: 10px; margin: 10px;">
      DEBUG: LoginView is loading. If you see this, routing works.
      Auth status: {{ authStore.isAuthenticated }}
    </div>
    
    <!-- Rest of your template -->
    <v-container fluid class="fill-height">
      <!-- ... existing code ... -->
    </v-container>
  </div>
</template>
```

### 9. Check Node.js Version
Ensure you're using a compatible Node.js version:

```bash
node --version
# Should be 18.x or higher
```

### 10. Reinstall Dependencies
If all else fails, try reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Common Issues and Solutions

### Issue: "Cannot resolve @/ imports"
**Solution**: Check that your `vite.config.ts` has the correct alias configuration:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### Issue: Vuetify components not rendering
**Solution**: Verify Vuetify is properly configured in `src/plugins/vuetify.ts`:

```typescript
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  // ... rest of config
})
```

### Issue: Router not working
**Solution**: Check that router is properly imported in `src/main.ts`:

```typescript
import router from './router'
app.use(router)
```

### Issue: Store not accessible
**Solution**: Verify Pinia is configured in `src/main.ts`:

```typescript
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)
```

## Test the App

Run the test script to verify everything is working:

```bash
node test-app.js
```

This will start the server and verify the app loads correctly.

## Get Help

If none of these solutions work:
1. Check the browser console for specific error messages
2. Verify all dependencies are installed correctly
3. Make sure the backend API is running (if testing login functionality)
4. Try running the app in incognito/private mode to rule out extension conflicts