import { supabase } from './supabase'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing VITE_GOOGLE_CLIENT_ID environment variable')
}

// Google OAuth scopes
const SCOPES = [
  'openid',
  'email',
  'profile'
].join(' ')

// Google OAuth URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
  given_name?: string
  family_name?: string
}

export class GoogleAuthService {
  /**
   * Generate Google OAuth authorization URL
   */
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
      response_type: 'code',
      scope: SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState()
    })

    // Store state in sessionStorage for verification
    sessionStorage.setItem('google_oauth_state', params.get('state')!)

    return `${GOOGLE_AUTH_URL}?${params.toString()}`
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  /**
   * Verify state parameter to prevent CSRF attacks
   */
  private static verifyState(state: string): boolean {
    const storedState = sessionStorage.getItem('google_oauth_state')
    sessionStorage.removeItem('google_oauth_state')
    return storedState === state
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string, state: string): Promise<string> {
    if (!this.verifyState(state)) {
      throw new Error('Invalid state parameter - possible CSRF attack')
    }

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()
    return data.access_token
  }

  /**
   * Get user information from Google using access token
   */
  static async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch(`${GOOGLE_USERINFO_URL}?access_token=${accessToken}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user information')
    }

    return await response.json()
  }

  /**
   * Complete Google OAuth flow and create/login user
   */
  static async handleCallback(code: string, state: string, userType: 'student' | 'counselor' = 'student'): Promise<{ user: GoogleUser, isNewUser: boolean }> {
    try {
      // Exchange code for access token
      const accessToken = await this.exchangeCodeForToken(code, state)
      
      // Get user information
      const googleUser = await this.getUserInfo(accessToken)
      
      // Check if user already exists in Supabase
      const { data: existingUser } = await supabase.auth.getUser()
      
      if (existingUser.user) {
        // User is already logged in
        return { user: googleUser, isNewUser: false }
      }

      // Try to sign in with Google email
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: googleUser.email,
        password: 'google_oauth_user' // This won't work, but we'll handle it
      })

      if (signInError) {
        // User doesn't exist, create new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: googleUser.email,
          password: Math.random().toString(36).substring(2, 15), // Random password for OAuth users
          options: {
            data: {
              full_name: googleUser.name,
              picture: googleUser.picture,
              provider: 'google'
            }
          }
        })

        if (signUpError) {
          throw new Error(`Failed to create user: ${signUpError.message}`)
        }

        if (signUpData.user) {
          // Create profile in appropriate table
          if (userType === 'student') {
            await supabase.from('students').insert({
              id: signUpData.user.id,
              email: googleUser.email,
              full_name: googleUser.name,
            })
          } else {
            await supabase.from('counsellors').insert({
              id: signUpData.user.id,
              email: googleUser.email,
              full_name: googleUser.name,
              is_admin: false,
            })
          }
        }

        return { user: googleUser, isNewUser: true }
      }

      return { user: googleUser, isNewUser: false }
    } catch (error) {
      console.error('Google OAuth error:', error)
      throw error
    }
  }

  /**
   * Initiate Google OAuth flow
   */
  static signInWithGoogle(): void {
    const authUrl = this.getAuthUrl()
    window.location.href = authUrl
  }

  /**
   * Sign in with Google using popup (alternative method)
   */
  static async signInWithGooglePopup(userType: 'student' | 'counselor' = 'student'): Promise<{ user: GoogleUser, isNewUser: boolean }> {
    return new Promise((resolve, reject) => {
      const authUrl = this.getAuthUrl()
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      if (!popup) {
        reject(new Error('Failed to open popup window'))
        return
      }

      // Listen for popup to close or receive message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          reject(new Error('OAuth popup was closed'))
        }
      }, 1000)

      // Listen for messages from popup
      const messageListener = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()

          try {
            const result = await this.handleCallback(event.data.code, event.data.state, userType)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener('message', messageListener)
    })
  }
}

// Export convenience functions
export const signInWithGoogle = GoogleAuthService.signInWithGoogle
export const signInWithGooglePopup = GoogleAuthService.signInWithGooglePopup
export const handleGoogleCallback = GoogleAuthService.handleCallback