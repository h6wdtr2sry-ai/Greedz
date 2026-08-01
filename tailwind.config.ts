import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#07080d",
          900: "#0c0e16",
          800: "#12151f",
          700: "#1a1e2c",
          600: "#252a3d",
        },
        ember: {
          400: "#ffb84d",
          500: "#ff9d2e",
          600: "#e6821a",
        },
        rarity: {
          basic: "#8a93a6",
          elite: "#6bc7ff",
          special: "#6bffb0",
          epic: "#c084fc",
          legend: "#ffd24d",
          collector: "#ff6b6b",
          mythic: "#b06bff",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        heading: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        script: ["var(--font-bangers)", "cursive"],
        title: ["var(--font-cinzel)", "serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #fff6d5 0%, #ffd24d 45%, #b8860b 100%)",
        "gradient-diamond": "linear-gradient(135deg, #e8f9ff 0%, #6bc7ff 45%, #1a5f8a 100%)",
        "gradient-mythic": "linear-gradient(135deg, #f2e5ff 0%, #b06bff 45%, #5a1f9e 100%)",
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(255, 157, 46, 0.55)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
