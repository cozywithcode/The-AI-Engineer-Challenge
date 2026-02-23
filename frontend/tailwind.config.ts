import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      colors: {
        forest: {
          floor: "#2d5016",
          shadow: "#1a3009",
          moss: "#4a7c23",
          leaf: "#6b8e23",
          canopy: "#228b22",
          bark: "#5d4e37",
          sunlight: "#fcecb8",
          "sunlight-soft": "#fff8dc",
          dappled: "#8fbc8f",
          fern: "#3d5c2e",
        },
      },
      animation: {
        "leaf-shimmer": "leafShimmer 5s ease-in-out infinite",
      },
      keyframes: {
        leafShimmer: {
          "0%, 100%": { opacity: "0.92" },
          "50%": { opacity: "1" },
        },
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
