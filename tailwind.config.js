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
          // Extended palette (from design-system-v1.md)
          'deep-navy': '#1A1A2E',     // headers, primary text
          'electric-blue': '#0066FF', // interactive elements, links
          'signal-green': '#00C851',  // positive feedback, improvement indicators
          'warm-amber': '#FFB300',    // warnings, attention states
          'soft-gray': '#F5F5F7',     // card backgrounds, subtle dividers
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
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
