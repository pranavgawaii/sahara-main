import { SignUp } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'

import SaharaAuthLayout from '@/components/layout/SaharaAuthLayout'

const ClerkSignUpPage = () => {
  const [params] = useSearchParams()
  const role = params.get('role') === 'counselor' ? 'counselor' : 'student'
  const afterUrl = role === 'counselor' ? '/counselor/dashboard' : '/simple-onboarding'

  return (
    <SaharaAuthLayout>
      <div className="relative z-10 font-inter w-full max-w-[440px] mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 font-dm">Join Sahara</h1>
          <p className="text-blue-100">Create your anonymous account today</p>
        </div>
        <SignUp
          fallbackRedirectUrl={afterUrl}
          forceRedirectUrl={afterUrl}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[24px] p-8 w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formFieldLabel: "text-slate-700 font-medium",
              formButtonPrimary: "bg-[#2E5A7D] hover:bg-[#1e405a] text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5",
              socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-medium rounded-xl py-2.5 transition-all duration-300",
              footerActionLink: "text-[#2E5A7D] font-bold hover:text-[#1e405a]",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400 bg-transparent flex-1",
              formFieldInput: "rounded-xl border-slate-200 focus:border-[#2E5A7D] focus:ring-[#2E5A7D]/20 bg-white/50",
              clerkBranding: "hidden",
              developmentBadge: "hidden"
            },
            layout: {
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton'
            }
          }}
        />
      </div>
    </SaharaAuthLayout>
}

export default ClerkSignUpPage