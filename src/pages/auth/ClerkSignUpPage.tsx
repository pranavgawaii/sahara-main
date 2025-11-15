import { SignUp } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'

const ClerkSignUpPage = () => {
  const [params] = useSearchParams()
  const role = params.get('role') === 'counselor' ? 'counselor' : 'student'
  const afterUrl = role === 'counselor' ? '/counselor/dashboard' : '/simple-onboarding'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignUp fallbackRedirectUrl={afterUrl} forceRedirectUrl={afterUrl} />
    </div>
  )
}

export default ClerkSignUpPage