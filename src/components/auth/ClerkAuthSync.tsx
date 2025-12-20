import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useAuthStore } from '@/stores/authStore'
import { useStore } from '@/stores/useStore'

const ClerkAuthSync = () => {
  const { isSignedIn, getToken, isLoaded } = useAuth()
  const { user } = useUser()
  const { login, logout } = useAuthStore()
  const { setStudent, completeOnboarding } = useStore()

  useEffect(() => {
    const sync = async () => {
      if (!isLoaded) return;

      if (isSignedIn && user) {
        console.log('ClerkAuthSync: User signed in', { userId: user.id, email: user.primaryEmailAddress?.emailAddress })

        let token = ''
        try {
          // Try to get token without template first (more reliable)
          token = (await getToken()) || ''
          console.log('ClerkAuthSync: Token retrieved successfully')
        } catch (e) {
          console.warn('ClerkAuthSync: Failed to get Clerk token:', e)
          token = user.id // Fallback to user ID if token retrieval fails
        }

        const role = (user.publicMetadata?.role as 'student' | 'counselor') || 'student'
        const email = user.primaryEmailAddress?.emailAddress || ''
        const name = user.fullName || user.username || email
        const picture = user.imageUrl
        const googleId = user.externalAccounts && user.externalAccounts.length > 0 ? (user.externalAccounts[0] as any).providerUserId || user.id : user.id

        // Sync to auth store
        login({ id: user.id, email, name, picture, role, googleId }, token)
        console.log('ClerkAuthSync: Auth store updated')

        // Also create student data in main store for dashboard compatibility
        const ephemeralHandle = name || `user_${user.id.substr(0, 8)}`
        const institutionCode = user.publicMetadata?.institution as string || 'Unknown Institution'

        setStudent({
          token: token || user.id,
          institutionCode,
          ephemeralHandle,
          language: 'en',
          role: role as 'student' | 'counsellor' | 'staff',
          consentFlags: {
            dataProcessing: true,
            anonymousChat: true,
            counselorContact: true
          },
          createdAt: new Date()
        })

        completeOnboarding()
        console.log('ClerkAuthSync: Main store updated with student data')
      } else if (isLoaded && !isSignedIn) {
        console.log('ClerkAuthSync: User not signed in, clearing data')
        logout()
        // Also clear student data from main store
        const { clearUserData } = useStore.getState()
        clearUserData()
      }
    }
    sync()
  }, [isLoaded, isSignedIn, user, getToken, login, logout, setStudent, completeOnboarding])

  return null
}

export default ClerkAuthSync