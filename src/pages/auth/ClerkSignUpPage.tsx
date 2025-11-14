import { SignUp } from '@clerk/clerk-react'

const ClerkSignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignUp afterSignUpUrl="/dashboard" redirectUrl="/auth/sign-up" />
    </div>
  )
}

export default ClerkSignUpPage