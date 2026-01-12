import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                inter: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
                dm: ["DM Sans", "sans-serif"], // Added for Reference
                handwriting: ["Caveat", "cursive"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#2E5A7D", // Professional Blue
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#7BA5C8", // Soft Blue
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#F0F0F0",
                    foreground: "#6B6B6B",
                },
                accent: {
                    DEFAULT: "#E8F2F8", // Soft Blue Accent
                    foreground: "#2E5A7D",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Blue Sky Palette
                sky: {
                    dark: "#2E5A7D",
                    medium: "#7BA5C8",
                    light: "#8BADC7",
                    pale: "#A8C5DC",
                    soft: "#E8F2F8",
                },
                // Legacy Mappings
                sahara: {
                    brown: "#2E5A7D", // Re-mapped to blue for components using old names
                    gold: "#7BA5C8",
                    cream: "#FFFFFF",
                },

                // Semantic Colors (Restored compatibility)
                "relationship-warm": "hsl(var(--relationship-warm))",
                "career-focused": "hsl(var(--career-focused))",
                "academic-neutral": "hsl(var(--academic-neutral))",
                "family-gentle": "hsl(var(--family-gentle))",
                "sleep-dark": "hsl(var(--sleep-dark))",
                "social-open": "hsl(var(--social-open))",
                "mixed-flexible": "hsl(var(--mixed-flexible))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                soft: "0 4px 16px rgba(46, 90, 125, 0.08)",
                glass: "0 8px 32px rgba(46, 90, 125, 0.12)",
                float: "0 12px 40px rgba(0, 0, 0, 0.08)",
            },
            animation: {
                "float-particle": "float-particle 8s ease-in-out infinite",
                "float-card": "float-card 6s ease-in-out infinite",
                "float-slow": "float-slow 15s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "fade-in-up": "fade-in-up 0.8s ease-out forwards",
                "bounce-slow": "bounce-slow 2s ease-in-out infinite",
            },
            transitionTimingFunction: {
                "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
            keyframes: {
                "float-particle": {
                    "0%, 100%": { transform: "translateY(0) translateX(0)" },
                    "25%": { transform: "translateY(-10px) translateX(5px)" },
                    "50%": { transform: "translateY(-20px) translateX(0)" },
                    "75%": { transform: "translateY(-10px) translateX(-5px)" },
                },
                "float-card": {
                    "0%, 100%": { transform: "translateY(0) rotate(var(--rotation))" },
                    "50%": { transform: "translateY(-10px) rotate(var(--rotation))" },
                },
                "float-slow": {
                    "0%, 100%": { transform: "translateY(0) translateX(0)" },
                    "50%": { transform: "translateY(-20px) translateX(10px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.8", boxShadow: "0 0 20px rgba(255,255,255,0.3)" },
                    "50%": { opacity: "1", boxShadow: "0 0 30px rgba(255,255,255,0.5)" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(0) translateX(-50%)" },
                    "50%": { transform: "translateY(-10px) translateX(-50%)" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
