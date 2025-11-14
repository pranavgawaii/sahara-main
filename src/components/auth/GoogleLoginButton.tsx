import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { GoogleAuthService } from '@/lib/googleAuth'

interface GoogleLoginButtonProps {
  userType?: 'student' | 'counselor'
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  usePopup?: boolean
  onSuccess?: (user: any) => void
  onError?: (error: string) => void
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  userType = 'student',
  variant = 'outline',
  size = 'default',
  className = '',
  usePopup = true,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, login } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true)
        const user = await GoogleAuthService.getUserInfo(tokenResponse.access_token)

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: userType,
          picture: user.picture,
          googleId: user.id
        }

        login(userData, tokenResponse.access_token)

        toast({
          title: 'Success!',
          description: `Welcome ${user.name}!`,
        })

        if (userType === 'counselor') {
          navigate('/counselor/dashboard')
        } else {
          navigate('/dashboard')
        }

        onSuccess?.(user)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        toast({
          title: 'Authentication Failed',
          description: errorMessage,
          variant: 'destructive',
        })
        onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      toast({
        title: 'Authentication Failed',
        description: 'Google authentication failed',
        variant: 'destructive',
      })
      setIsLoading(false)
      onError?.('Google authentication failed')
    },
    ux_mode: usePopup ? 'popup' : 'redirect',
    scope: 'openid email profile',
  })

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    googleLogin()
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`w-full ${className}`}
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  )
}

export default GoogleLoginButton