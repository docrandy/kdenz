/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Performance Clinical palette
        clinical: {
          bg: '#FFFFFF',        // white background
          text: '#000000',      // black text
          accent: '#00D4FF',    // electric teal/cyan
          'accent-hover': '#00B8E6', // slightly darker teal for hover
          muted: '#6B7280',     // gray for secondary text
          border: '#E5E7EB',    // light gray for borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      }
    }
  },
  plugins: [],
}
