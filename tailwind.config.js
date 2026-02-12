/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== SEMANTIC TOKENS (Layer 2) =====
        background: {
          DEFAULT: "var(--color-navy-950)",
          surface: "var(--color-navy-900)",
          elevated: "var(--color-navy-800)",
          subtle: "var(--color-navy-700)",
        },
        text: {
          DEFAULT: "var(--color-cream-100)",
          muted: "var(--color-muted-tan)",
          subtle: "var(--color-muted-brown)",
          inverse: "var(--color-black)",
        },
        accent: {
          DEFAULT: "var(--color-gold-500)",
          hover: "var(--color-gold-400)",
        },
        status: {
          success: "var(--color-status-success)",
          info: "var(--color-status-info)",
          warning: "var(--color-status-warning)",
          error: "var(--color-status-error)",
        },

        // ===== OLD PALETTE (keep for Phase 12 migration) =====
        clinical: {
          bg: "#FFFFFF",
          text: "#000000",
          accent: "#00D4FF",
          "accent-hover": "#00B8E6",
          muted: "#6B7280",
          border: "#E5E7EB",
          "deep-navy": "#1A1A2E",
          "electric-blue": "#0066FF",
          "signal-green": "#00C851",
          "warm-amber": "#FFB300",
          "soft-gray": "#F5F5F7",
        },
      },

      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        sans: ["var(--font-body)"],
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
