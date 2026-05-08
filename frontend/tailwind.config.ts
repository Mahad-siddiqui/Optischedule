import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1425",
          elevated: "#151b2e",
          overlay: "rgba(15, 20, 37, 0.72)",
        },
        border: {
          subtle: "rgba(99, 122, 179, 0.12)",
          glow: "rgba(56, 189, 248, 0.2)",
        },
      },
      boxShadow: {
        panel: "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        glow: "0 0 48px rgba(56, 189, 248, 0.1)",
        "glow-lg": "0 0 80px rgba(56, 189, 248, 0.15)",
      },
      gridTemplateColumns: {
        timetable: "96px repeat(5, minmax(260px, 1fr))",
      },
      gridTemplateRows: {
        timetable: "52px repeat(8, 188px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(rgba(99, 122, 179, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 122, 179, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
