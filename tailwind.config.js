/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Design system accent — cold teal (OKLCH mapped to hex fallback) */
        accent: 'var(--ds-accent)',
        surface: 'var(--ds-bg-surface)',
        elevated: 'var(--ds-bg-elevated)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['"Michroma"', '"Space Grotesk"', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'var(--ds-border)',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'scroll-up': 'scrollUp 22s linear infinite',
        'scroll-down': 'scrollDown 22s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
