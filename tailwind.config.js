/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#171916',
          deep: '#222620',
          card: '#1D211C',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#282D25',
        },
        lime: {
          brand: '#B7F36B',
          glow: 'rgba(183, 243, 107, 0.25)',
        },
        orange: {
          brand: '#FF914D',
          glow: 'rgba(255, 145, 77, 0.25)',
        },
        purple: {
          brand: '#A78BFA',
          glow: 'rgba(167, 139, 250, 0.25)',
        },
        yellow: {
          brand: '#FDE047',
        },
        text: {
          white: '#F8FAF5',
          muted: '#B8BDB5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(183, 243, 107, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(167, 139, 250, 0.3)',
        'glow-orange': '0 0 25px -5px rgba(255, 145, 77, 0.3)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
