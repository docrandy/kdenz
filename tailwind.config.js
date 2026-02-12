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
      },

      fontSize: {
        // Heading scale (Cormorant Garamond)
        display: ["3rem", { lineHeight: "1.1", letterSpacing: "0.02em" }], // 48px
        h1: ["2.25rem", { lineHeight: "1.2", letterSpacing: "0.015em" }], // 36px
        h2: ["1.75rem", { lineHeight: "1.2", letterSpacing: "0.01em" }], // 28px
        h3: ["1.5rem", { lineHeight: "1.3", letterSpacing: "0.01em" }], // 24px
        h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "0.005em" }], // 20px
        h5: ["1.125rem", { lineHeight: "1.4" }], // 18px
        // Body scale (Outfit)
        "body-lg": ["1.125rem", { lineHeight: "1.6" }], // 18px
        body: ["1rem", { lineHeight: "1.6" }], // 16px
        "body-sm": ["0.875rem", { lineHeight: "1.5" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.4" }], // 12px
        overline: [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ], // 11px
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
