import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hud/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: "#0a0806",
          amber: "#c4813a",
          gold: "#e8a54b",
          wheat: "#f5deb3",
          muted: "#6a5a4a",
          "muted-mid": "#5a4a3a",
          "muted-dark": "#4a3a2a",
        },
        zone: {
          "skill-tree": "#44aa88",
          vault: "#aa6622",
          timeline: "#6644aa",
          "war-room": "#22aacc",
        },
        tier: {
          legendary: "#ff6600",
          epic: "#cc44ff",
          rare: "#4488ff",
          common: "#44aa66",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
