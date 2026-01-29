import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#05070a",
        neon: "#00f5a0",
        cyan: "#00d9ff",
        haze: "#0a1f2a",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 245, 160, 0.35)",
        glowCyan: "0 0 20px rgba(0, 217, 255, 0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(0, 245, 160, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 217, 255, 0.08) 1px, transparent 1px)",
      },
      animation: {
        flicker: "flicker 3s linear infinite",
        scan: "scan 6s linear infinite",
        pulseSlow: "pulseSlow 5s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.92" },
          "5%": { opacity: "0.6" },
          "10%": { opacity: "0.98" },
          "15%": { opacity: "0.85" },
          "20%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        scan: {
          "0%": { transform: "translateY(-30%)" },
          "100%": { transform: "translateY(30%)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
