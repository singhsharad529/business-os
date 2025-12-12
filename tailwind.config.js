/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#F29AAE", // soft coral/pink
          soft: "#FCE4EA",
          strong: "#E87D99",
        },
        accent: {
          DEFAULT: "#7132CA", // deep violet
          soft: "#EFE4FB",
          strong: "#301CA0",
        },
        highlight: {
          DEFAULT: "#C47BE4", // lavender highlight
          soft: "#F4E7FB",
        },
        steel: {
          DEFAULT: "#1A1B25",
          light: "#2A2B35",
        },
        bg: "#F6F7FB",
        surface: "#FFFFFF",
        border: {
          DEFAULT: "#D9E1EC",
          subtle: "#E6EAF2",
          muted: "#EEF2F7",
        },
        text: {
          main: "#0F172A",
          muted: "#475467",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#E8F7EE",
        },
        danger: {
          DEFAULT: "#EF4444",
          soft: "#FEEBEB",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FFF4E5",
        },
      },
      borderRadius: {
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.06)",
        soft: "0 4px 18px rgba(15, 23, 42, 0.08)",
        card: "0 10px 40px rgba(15, 23, 42, 0.08)",
        glow: "0 10px 30px rgba(37, 99, 235, 0.18)",
      },
    },
  },
  plugins: [],
};
