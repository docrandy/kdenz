// kdenz-tailwind-preset.js
// Drop this into your project and reference it in tailwind.config.js as a preset
// Usage: presets: [require('./kdenz-tailwind-preset')]

module.exports = {
  theme: {
    extend: {
      colors: {
        kdenz: {
          // Backgrounds — Layered Depth (darkest to lightest)
          base: '#0A0A0B',
          surface: '#101113',
          elevated: '#1A1B1D',
          hover: '#222326',
          active: '#2A2B2F',

          // Semantic Accents
          danger: '#C41F2F',       // Zone 5, alerts, aggression
          success: '#1DB954',      // Sweet spot, positive feedback
          info: '#0052CC',         // Progress, links, neutral data
          warning: '#F59E0B',      // Caution, approaching limits
          premium: '#8B5CF6',      // Scores, achievements

          // Accent Hover States
          'danger-hover': '#D42A3A',
          'success-hover': '#22D35E',
          'info-hover': '#1A6AE0',
          'warning-hover': '#FBBF24',
          'premium-hover': '#A78BFA',

          // Text
          'text-primary': '#F0F0F0',
          'text-secondary': '#8A8F98',
          'text-muted': '#555960',
          'text-on-accent': '#FFFFFF',

          // Borders
          'border-subtle': '#1E1F23',
          'border-focus': '#0052CC',
        },
      },

      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },

      fontSize: {
        'metric': ['2.5rem', { lineHeight: '1', fontWeight: '600' }],
        'metric-sm': ['1.875rem', { lineHeight: '1', fontWeight: '600' }],
      },

      spacing: {
        // Enforce 4px grid
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
      },

      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'pill': '9999px',  // Only for status indicators, never buttons
        'sm': '6px',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'deep': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'glow-success': '0 0 20px rgba(29, 185, 84, 0.4), 0 0 40px rgba(29, 185, 84, 0.2)',
        'glow-success-intense': '0 0 30px rgba(29, 185, 84, 0.6), 0 0 60px rgba(29, 185, 84, 0.3)',
        'glow-danger': '0 0 20px rgba(196, 31, 47, 0.4), 0 0 40px rgba(196, 31, 47, 0.2)',
        'glow-premium': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-info': '0 0 20px rgba(0, 82, 204, 0.3), 0 0 40px rgba(0, 82, 204, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },

      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'danger-pulse': 'danger-pulse 0.8s ease-in-out infinite',
        'metric-update': 'metric-update 200ms ease-out',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(29, 185, 84, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(29, 185, 84, 0.6)' },
        },
        'danger-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'metric-update': {
          '0%': { transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      backgroundImage: {
        // Subtle radial glow for page backgrounds
        'page-glow-blue': 'radial-gradient(ellipse at 50% 0%, rgba(0, 82, 204, 0.06) 0%, transparent 70%)',
        'page-glow-green': 'radial-gradient(ellipse at 50% 0%, rgba(29, 185, 84, 0.04) 0%, transparent 70%)',
        'page-glow-premium': 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
      },

      backdropBlur: {
        'glass': '16px',
      },

      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
}
