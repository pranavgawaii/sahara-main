import { SignIn } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'
import AuthForm from '@/components/ui/auth-form'
import { Link } from 'react-router-dom'

const ClerkSignInPage = () => {
  const [params] = useSearchParams()
  const role = params.get('role') === 'counselor' ? 'counselor' : 'student'
  const afterUrl = role === 'counselor' ? '/counselor/dashboard' : '/simple-onboarding'

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle={
        <p>
          Don't have an account?{' '}
          <Link to={`/auth/sign-up?role=${role}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            Create one.
          </Link>
        </p>
      }
    >
      <SignIn
        fallbackRedirectUrl={afterUrl}
        forceRedirectUrl={afterUrl}
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-8 w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldLabel: "text-zinc-700 dark:text-zinc-300 font-medium mb-1.5",
            formButtonPrimary: "bg-gradient-to-br from-blue-400 to-blue-700 hover:brightness-110 text-zinc-50 font-bold py-2.5 rounded-md shadow-sm transition-all duration-300 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950",
            socialButtonsBlockButton: "border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium rounded-md py-2 transition-all duration-300",
            footerActionLink: "text-blue-600 dark:text-blue-400 font-bold hover:underline",
            dividerLine: "bg-zinc-300 dark:bg-zinc-700",
            dividerText: "text-zinc-500 dark:text-zinc-400 bg-transparent flex-1",
            formFieldInput: "rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:ring-blue-500 focus:border-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            clerkBranding: "!hidden",
            developmentBadge: "!hidden"
          },
          layout: {
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton'
          }
        }}
      />
    </AuthForm>
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