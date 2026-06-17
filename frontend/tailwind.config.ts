import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        panel: "#f7f7f2",
        brand: "#e64235",
        mint: "#50b894"
      }
    }
  },
  plugins: []
};

export default config;
