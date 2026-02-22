import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          floor: "#2d5016",
          shadow: "#1a3009",
          moss: "#4a7c23",
          leaf: "#6b8e23",
          canopy: "#228b22",
          bark: "#5d4e37",
          sunlight: "#f4e4a6",
          dappled: "#8fbc8f",
          fern: "#3d5c2e",
        },
      },
      animation: {
        "sun-ray": "sunRay 2s ease-out forwards",
        "leaf-shimmer": "leafShimmer 4s ease-in-out infinite",
      },
      keyframes: {
        sunRay: {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "40%": { opacity: "0.9", transform: "scaleY(1)" },
          "100%": { opacity: "0.6", transform: "scaleY(1)" },
        },
        leafShimmer: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "forest-gradient":
          "linear-gradient(180deg, #1a3009 0%, #2d5016 25%, #3d5c2e 50%, #4a7c23 75%, #2d5016 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
