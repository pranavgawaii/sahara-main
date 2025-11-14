import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GoogleAuthService } from '@/lib/googleAuth'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const userType = searchParams.get('user_type') as 'student' | 'counselor' || 'student'

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter')
        }

        // Handle the OAuth callback
        const { user, isNewUser } = await GoogleAuthService.handleCallback(code, state, userType)

        // Update auth store
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: userType,
          picture: user.picture,
          googleId: user.id
        })

        // If this is a popup, send message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_OAUTH_SUCCESS',
            code,
            state,
            user,
            isNewUser
          }, window.location.origin)
          window.close()
          return
        }

        // Redirect based on user type and whether they're new
        if (isNewUser) {
          navigate('/onboarding', { replace: true })
        } else {
          const redirectPath = userType === 'student' ? '/dashboard' : '/counselor/dashboard'
          navigate(redirectPath, { replace: true })
        }
      } catch (err) {
        console.error('Google OAuth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)

        // If this is a popup, send error to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_OAUTH_ERROR',
            error: errorMessage
          }, window.location.origin)
          window.close()
          return
        }

        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, navigate, setUser])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing your sign-in...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your Google account.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return null
}

export default GoogleCallback