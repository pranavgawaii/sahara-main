import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <div className="relative flex items-center bg-background/50 backdrop-blur-md border border-primary/20 rounded-full p-1 gap-1 shadow-sm">
            <button
                onClick={() => setTheme("light")}
                className={`relative z-10 p-1.5 rounded-full transition-colors duration-200 ${!isDark ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-primary/70"
                    }`}
                aria-label="Switch to light mode"
            >
                <Sun className="h-4 w-4" />
                {theme === "light" && (
                    <motion.div
                        layoutId="theme-active-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}
                    />
                )}
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`relative z-10 p-1.5 rounded-full transition-colors duration-200 ${isDark ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-primary/70"
                    }`}
                aria-label="Switch to dark mode"
            >
                <Moon className="h-4 w-4" />
                {theme === "dark" && (
                    <motion.div
                        layoutId="theme-active-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}
                    />
                )}
            </button>
        </div>
    )
}
