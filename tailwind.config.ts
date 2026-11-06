import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "#d94b28",
          light: "#feece7",
        },
        secondary: "var(--secondary)",
        surface: "var(--surface)",
        cream: {
          50: "#FAF8F2",
          100: "#F7F4EB",
          200: "#EFEADB",
          300: "#E5DEC9",
        },
        border: "var(--border)",
        brand: {
          green: "var(--green)",
          yellow: "var(--yellow)",
          dark: "#1A1915",
          red: "#F15A35",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        receipt: ["var(--font-receipt)", "Courier New", "monospace"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(41, 40, 32, 0.04)",
        card: "0 6px 20px rgba(41, 40, 32, 0.07)",
        elevated: "0 14px 40px rgba(41, 40, 32, 0.12)",
        bowl: "0 30px 60px -15px rgba(41, 40, 32, 0.25), 0 10px 20px -5px rgba(41, 40, 32, 0.1)",
        lid: "0 35px 70px -10px rgba(41, 40, 32, 0.35)",
        floating: "0 20px 30px -10px rgba(241, 90, 53, 0.3)",
      },
      borderRadius: {
        editorial: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGently: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-gently": "pulseGently 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

