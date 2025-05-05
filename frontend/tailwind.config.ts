import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};

export default config;
