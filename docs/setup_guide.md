# Supabase Authentication Setup Guide

## Prerequisites
1. Supabase project created
2. Environment variables configured with:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (for admin operations)

## Step-by-Step Setup

### 1. Database Setup
1. Navigate to your Supabase SQL Editor
2. Execute the provided SQL code from `database/auth_tables.sql`
3. Verify tables appear in the Table Editor

### 2. Authentication Setup
1. Go to Authentication → Settings
2. Enable Email provider
3. Configure site URL and redirect URLs:
   - Development: `http://localhost:8081`
   - Production: Your actual domain
4. Set password requirements (recommended: minimum 8 characters)
5. Configure OAuth providers if needed (Google, GitHub, etc.)

### 3. Row Level Security (RLS)
The SQL script already includes RLS policies, but here's what they do:

1. **Students table policies:**
   ```sql
   ALTER TABLE students ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Students can view their own data"
   ON students FOR SELECT USING (auth.uid() = id);
   ```

2. **Counsellors table policies:**
   ```sql
   ALTER TABLE counsellors ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Counsellors can view their own data"
   ON counsellors FOR SELECT USING (auth.uid() = id);
   ```

3. **Admin access policies:**
   - Admin counsellors can view all student and counsellor data
   - Regular counsellors can only view their own data

### 4. Environment Configuration
Update your `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Client Implementation
1. Install Supabase client library:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Initialize client in your application:
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

### 6. OAuth 2.0 Configuration
For Google OAuth integration:

**Authorized JavaScript Origins:**
- `http://localhost:8081` (development)
- `https://your-domain.com` (production)

**Authorized Redirect URIs:**
- `http://localhost:8081/auth/callback`
- `https://your-domain.com/auth/callback`
- Your Supabase auth callback URL

### 7. Testing
1. Create test accounts using the Authentication interface
2. Verify you can:
   - Sign up new users (students/counsellors)
   - Log in existing users
   - Access only permitted data via RLS
   - Admin counsellors can access all data
   - Regular users can only access their own data

### 8. Security Best Practices
1. **Never expose service role key** in client-side code
2. Use **anon key** for client-side operations
3. Implement **proper validation** on both client and server
4. **Regularly rotate** API keys
5. **Monitor** authentication logs for suspicious activity

### 9. Common Issues & Solutions

**Issue: RLS blocking legitimate access**
- Solution: Check policy conditions and ensure `auth.uid()` matches user ID

**Issue: OAuth redirect not working**
- Solution: Verify redirect URLs match exactly in both Supabase and OAuth provider

**Issue: Environment variables not loading**
- Solution: Ensure variables are prefixed with `VITE_` for Vite projects

### 10. Next Steps
1. Implement user registration flows
2. Add profile management features
3. Set up email verification
4. Configure password reset functionality
5. Add multi-factor authentication (optional)

## Support
For additional help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)