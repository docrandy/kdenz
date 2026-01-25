/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Peloton-style dark performance theme
        background: '#0A0A0B',
        surface: '#141416',
        'surface-elevated': '#1C1C1F',
        accent: '#00D4FF',
        'accent-hover': '#00B8E0',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
      },
    },
  },
  plugins: [],
}
