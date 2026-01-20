import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch or initial flicker
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder
    }

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (

        <button
            onClick={toggleTheme}
            className={`
                relative flex items-center justify-center w-9 h-9 rounded-sm
                transition-all duration-500 ease-out focus:outline-none 
                border border-transparent hover:border-amber-900/30
                ${isDark
                    ? 'bg-stone-900/50 text-amber-500 hover:bg-stone-800'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-amber-700'
                }
            `}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ y: 10, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {isDark ? (
                        <Moon className="w-4 h-4" strokeWidth={2} />
                    ) : (
                        <Sun className="w-4 h-4" strokeWidth={2} />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )

}
