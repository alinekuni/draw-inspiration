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
        paper: "#F5F0E8",
        ink: "#1A1814",
        olive: "#5C6B3A",
        "burnt-orange": "#C4622D",
        "muted-yellow": "#D4A843",
        "sky-blue": "#7BAFD4",
        "paper-dark": "#E8E0D0",
        "ink-muted": "#4A4540",
      },
      fontFamily: {
        display: ["Instrument Serif", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(26,24,20,0.08), 0 1px 2px rgba(26,24,20,0.06)",
        "card-lg":
          "0 4px 16px rgba(26,24,20,0.10), 0 2px 4px rgba(26,24,20,0.08)",
        tab: "2px -2px 6px rgba(26,24,20,0.06)",
      },
      backgroundImage: {
        "paper-grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
