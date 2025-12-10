/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF6321',
          soft: '#FFE1D0',
        },
        steel: {
          DEFAULT: '#1A1B25',
          light: '#2A2B35',
        },
        bg: '#F9FAFB',
        surface: '#FFFFFF',
        border: {
          subtle: '#E5E7EB',
        },
        text: {
          main: '#1A1B25',
          muted: '#4B5563',
        },
        success: {
          DEFAULT: '#16A34A',
          soft: '#DCFCE7',
        },
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          soft: '#FEF3C7',
        },
      },
      borderRadius: {
        md: '8px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
