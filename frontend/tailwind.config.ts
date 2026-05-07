import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)"
      },
      gridTemplateColumns: {
        timetable: "96px repeat(5, minmax(260px, 1fr))"
      },
      gridTemplateRows: {
        timetable: "52px repeat(8, 188px)"
      }
    }
  },
  plugins: []
} satisfies Config;
