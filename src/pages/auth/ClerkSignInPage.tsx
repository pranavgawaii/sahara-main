import { SignIn, SignUp } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'
import SaharaAuthLayout from '@/components/layout/SaharaAuthLayout'

const ClerkSignInPage = () => {
  const [params] = useSearchParams()
  const role = params.get('role') === 'counselor' ? 'counselor' : 'student'
  const afterUrl = role === 'counselor' ? '/counselor/dashboard' : '/simple-onboarding'

  return (
    <SaharaAuthLayout>
      <div className="relative z-10">
        <SignIn fallbackRedirectUrl={afterUrl} forceRedirectUrl={afterUrl} />
      </div>
    </SaharaAuthLayout>
  )
}

const ClerkSignUpPage = () => {
  const [params] = useSearchParams()
  const role = params.get('role') === 'counselor' ? 'counselor' : 'student'
  const afterUrl = role === 'counselor' ? '/counselor/dashboard' : '/simple-onboarding'

  return (
    <SaharaAuthLayout>
      <div className="relative z-10">
        <SignUp fallbackRedirectUrl={afterUrl} forceRedirectUrl={afterUrl} />
      </div>
    </SaharaAuthLayout>
  )
}

export default ClerkSignInPage