# Google Authentication Implementation Guide

## Overview

This guide provides a complete implementation of Google OAuth 2.0 authentication for the Wellbeing Buddy application using modern React patterns and Supabase integration.

## Architecture

The implementation consists of:

1. **GoogleAuthService** - Core authentication logic
2. **GoogleCallback** - OAuth callback handler
3. **GoogleLoginButton** - Reusable UI component
4. **Supabase Integration** - User profile management
5. **Auth Store Integration** - State management

## Files Created

### 1. Core Authentication Service
**File:** `src/lib/googleAuth.ts`

**Features:**
- CSRF protection with state parameter
- Token exchange and user info retrieval
- Supabase user creation and authentication
- Support for both redirect and popup flows
- TypeScript interfaces for type safety

### 2. OAuth Callback Handler
**File:** `src/pages/auth/GoogleCallback.tsx`

**Features:**
- Handles OAuth redirect from Google
- Processes authorization code
- Updates authentication state
- Supports popup window communication
- Error handling and user feedback
- Automatic redirection based on user type

### 3. Reusable Login Button
**File:** `src/components/auth/GoogleLoginButton.tsx`

**Features:**
- Customizable appearance (variant, size)
- Loading states and error handling
- Support for both student and counselor roles
- Popup or redirect authentication methods
- Toast notifications for user feedback

## Setup Instructions

### 1. Google Cloud Console Configuration

1. **Create OAuth 2.0 Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"

2. **Configure Authorized Origins:**
   ```
   http://localhost:8081
   https://your-production-domain.com
   ```

3. **Configure Redirect URIs:**
   ```
   http://localhost:8081/auth/google/callback
   https://your-production-domain.com/auth/google/callback
   ```

### 2. Environment Variables

Ensure your `.env` file contains:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:8081/auth/google/callback
```

### 3. Supabase Database Setup

Execute the SQL from `database/auth_tables.sql` to create the required tables:
- `students` table for student profiles
- `counsellors` table for counselor profiles
- Row Level Security policies
- Proper indexing

## Usage Examples

### Basic Login Button
```tsx
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'

// For students
<GoogleLoginButton userType="student" />

// For counselors
<GoogleLoginButton userType="counselor" />
```

### Custom Styling
```tsx
<GoogleLoginButton
  userType="student"
  variant="default"
  size="lg"
  className="my-custom-class"
/>
```

### Popup Authentication
```tsx
<GoogleLoginButton
  userType="student"
  usePopup={true}
  onSuccess={(user) => console.log('Login successful:', user)}
  onError={(error) => console.error('Login failed:', error)}
/>
```

### Manual Authentication Flow
```tsx
import { GoogleAuthService } from '@/lib/googleAuth'

// Redirect method
const handleLogin = () => {
  GoogleAuthService.signInWithGoogle()
}

// Popup method
const handlePopupLogin = async () => {
  try {
    const { user, isNewUser } = await GoogleAuthService.signInWithGooglePopup('student')
    console.log('User:', user, 'Is new:', isNewUser)
  } catch (error) {
    console.error('Authentication failed:', error)
  }
}
```

## Integration with Existing Components

### Login Page Integration

Add the Google login button to your existing login page:

```tsx
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'

const LoginPage = () => {
  return (
    <div className="login-form">
      {/* Existing email/password form */}
      
      <div className="divider">
        <span>or</span>
      </div>
      
      <GoogleLoginButton 
        userType="student" 
        className="mb-4"
      />
      
      <GoogleLoginButton 
        userType="counselor" 
        variant="secondary"
      />
    </div>
  )
}
```

### Auth Store Integration

The Google authentication automatically integrates with your existing auth store:

```tsx
import { useAuthStore } from '@/stores/authStore'

const SomeComponent = () => {
  const { user, isAuthenticated } = useAuthStore()
  
  if (isAuthenticated && user) {
    return <div>Welcome, {user.name}!</div>
  }
  
  return <GoogleLoginButton userType="student" />
}
```

## Security Features

### CSRF Protection
- State parameter generation and verification
- Session storage for state management
- Automatic cleanup after authentication

### Secure Token Handling
- Client-side token exchange
- No sensitive data in localStorage
- Proper error handling for failed requests

### User Data Protection
- Row Level Security in Supabase
- Role-based access control
- Secure user profile creation

## Error Handling

The implementation includes comprehensive error handling:

1. **OAuth Errors:** Invalid state, denied access, etc.
2. **Network Errors:** Failed API requests
3. **Database Errors:** User creation failures
4. **UI Feedback:** Toast notifications and loading states

## Testing

### Manual Testing Steps

1. **Test Redirect Flow:**
   - Click Google login button
   - Complete Google authentication
   - Verify redirect to correct dashboard
   - Check user data in auth store

2. **Test Popup Flow:**
   - Use popup authentication
   - Verify popup closes after success
   - Check error handling for popup blockers

3. **Test User Creation:**
   - Use new Google account
   - Verify user profile creation in Supabase
   - Test both student and counselor roles

4. **Test Error Scenarios:**
   - Deny Google permissions
   - Test with invalid credentials
   - Verify error messages display correctly

### Automated Testing

Consider adding tests for:
- GoogleAuthService methods
- Component rendering and interactions
- Error boundary behavior
- Auth store state updates

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch"**
   - Verify redirect URIs in Google Console match exactly
   - Check for trailing slashes and protocol differences

2. **"Invalid client ID"**
   - Ensure VITE_GOOGLE_CLIENT_ID is set correctly
   - Verify environment variables are loaded

3. **Popup blocked**
   - Inform users to allow popups
   - Provide fallback to redirect method

4. **CORS errors**
   - Verify authorized origins in Google Console
   - Check for localhost vs 127.0.0.1 differences

### Debug Mode

Enable debug logging by adding to your environment:
```env
VITE_DEBUG_AUTH=true
```

## Production Deployment

### Checklist

- [ ] Update Google Console with production domains
- [ ] Set production environment variables
- [ ] Enable HTTPS for production
- [ ] Test authentication flow in production
- [ ] Monitor error logs
- [ ] Set up proper CORS policies

### Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **Environment Variables:** Never commit secrets to version control
3. **Domain Validation:** Restrict OAuth to specific domains
4. **Rate Limiting:** Implement rate limiting for auth endpoints
5. **Monitoring:** Set up logging and monitoring for auth events

## Next Steps

1. **Multi-Factor Authentication:** Add MFA support
2. **Social Login:** Add other providers (Facebook, GitHub)
3. **Account Linking:** Allow linking multiple auth methods
4. **Session Management:** Implement proper session handling
5. **Audit Logging:** Add comprehensive auth event logging

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Google OAuth documentation
3. Check Supabase authentication guides
4. Review application logs for specific errors