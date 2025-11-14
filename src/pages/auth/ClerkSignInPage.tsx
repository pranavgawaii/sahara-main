import { SignIn } from '@clerk/clerk-react'

const ClerkSignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignIn afterSignInUrl="/dashboard" redirectUrl="/auth/sign-in" />
    </div>
  )
}

export default ClerkSignInPage