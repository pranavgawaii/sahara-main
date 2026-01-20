import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useNavigate } from "react-router-dom"


interface AuthFormProps {
    children?: React.ReactNode
    title?: string
    subtitle?: React.ReactNode
}

const AuthForm: React.FC<AuthFormProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900 relative overflow-hidden transition-colors duration-500 font-serif">
            <div className="absolute top-6 left-6 z-50">
                <BackButton />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4 flex flex-col items-center justify-center"
            >
                <Logo />
                <Header title={title} subtitle={subtitle} />
                {/* We render the Clerk component (passed as children) here, keeping the wrapper styles */}
                <div className="w-full flex justify-center">
                    {children}
                </div>
            </motion.div>
            <BackgroundDecoration />
        </div>
    )
}

const BackButton: React.FC = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors rounded-sm bg-stone-100 hover:bg-stone-200 border border-stone-200"
        >
            <ChevronLeft size={16} />
            <span>Go back</span>
        </button>
    )
}

const Logo: React.FC = () => (
    <div className="mb-6 flex flex-col items-center justify-center">
        <img
            src="/sahara.png"
            alt="Sahara Logo"
            className="h-12 w-12 rounded-xl object-cover mb-3"
        />
        <span className="text-2xl font-bold font-dm text-stone-900">Sahara</span>
    </div>
)

const Header: React.FC<{ title?: string; subtitle?: React.ReactNode }> = ({ title, subtitle }) => (
    <div className="mb-8 text-center">
        {title && <h1 className="text-3xl font-semibold mb-2">{title}</h1>}
        {subtitle && <div className="text-zinc-500 dark:text-zinc-400">{subtitle}</div>}
    </div>
)

const BackgroundDecoration: React.FC = () => {
    const { theme } = useTheme()
    const isDarkTheme = theme === "dark"

    return (
        <div
            className="absolute right-0 top-0 z-0 size-[50vw] pointer-events-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "radial-gradient(100% 100% at 100% 0%, rgba(255,255,255,0), rgba(255,255,255,1))"
                }}
            />
        </div>
    )
}

export default AuthForm
