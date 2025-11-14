import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useAuthStore } from '@/stores/authStore'

const ClerkAuthSync = () => {
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const { login, logout } = useAuthStore()

  useEffect(() => {
    const sync = async () => {
      if (isSignedIn && user) {
        const token = await getToken({ template: 'jwt' }) || ''
        const role = (user.publicMetadata?.role as 'student' | 'counselor') || 'student'
        const email = user.primaryEmailAddress?.emailAddress || ''
        const name = user.fullName || user.username || email
        const picture = user.imageUrl
        const googleId = user.externalAccounts && user.externalAccounts.length > 0 ? (user.externalAccounts[0] as any).providerUserId || user.id : user.id
        login({ id: user.id, email, name, picture, role, googleId }, token)
      } else {
        logout()
      }
    }
    sync()
  }, [isSignedIn, user, getToken, login, logout])

  return null
}

export default ClerkAuthSync