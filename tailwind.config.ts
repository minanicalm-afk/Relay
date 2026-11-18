import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#EAF7F0",
          100: "#D0EDDD",
          200: "#A3DBBC",
          300: "#71C59A",
          400: "#42A978",
          500: "#218C5C",
          600: "#157047",
          700: "#115A3B",
          800: "#0F4731",
          900: "#0C3A29",
          950: "#052117",
        },
        lime: {
          300: "#D9F99D",
          400: "#BEF264",
          500: "#A3E635",
          600: "#84CC16",
        },
        cream: "#F7FAF5",
        sand: "#EEF4E9",
        ink: "#0E1F19",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(12, 58, 41, 0.12)",
        card: "0 4px 24px -6px rgba(12, 58, 41, 0.1)",
        lift: "0 24px 60px -18px rgba(12, 58, 41, 0.28)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(12,58,41,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,58,41,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(163,230,53,0.18), transparent 60%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
