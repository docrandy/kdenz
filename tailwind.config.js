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
      }
    }
  },
  plugins: [],
}
