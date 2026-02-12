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
          heading: "var(--color-heading)",
          body: "var(--color-body)",
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
        display: ["4rem", { lineHeight: "1.1", letterSpacing: "0.02em" }], // 64px
        h1: ["3rem", { lineHeight: "1.15", letterSpacing: "0.015em" }], // 48px
        h2: ["2.25rem", { lineHeight: "1.2", letterSpacing: "0.01em" }], // 36px
        h3: ["1.75rem", { lineHeight: "1.25", letterSpacing: "0.01em" }], // 28px
        h4: ["1.5rem", { lineHeight: "1.3", letterSpacing: "0.005em" }], // 24px
        h5: ["1.25rem", { lineHeight: "1.4" }], // 20px
        // Body scale (Outfit)
        "body-lg": ["1.25rem", { lineHeight: "1.6" }], // 20px
        body: ["1.125rem", { lineHeight: "1.6" }], // 18px
        "body-sm": ["1rem", { lineHeight: "1.5" }], // 16px
        caption: ["0.875rem", { lineHeight: "1.4" }], // 14px
        overline: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ], // 12px
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
