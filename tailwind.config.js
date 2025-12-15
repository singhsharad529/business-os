/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#F29AAE", // soft coral/pink
          soft: "#FCE4EA",
          strong: "#E87D99",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#7132CA", // deep violet
          soft: "#EFE4FB",
          strong: "#301CA0",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: {
          DEFAULT: "#D9E1EC",
          subtle: "#E6EAF2",
          muted: "#EEF2F7",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "18px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.06)",
        soft: "0 4px 18px rgba(15, 23, 42, 0.08)",
        card: "0 4px 24px rgba(15, 23, 42, 0.04)",
        glow: "0 10px 30px rgba(37, 99, 235, 0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
