/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#05070f',
          950: '#07080c',
          900: '#080c1a',
          800: '#0b1022',
          700: '#101733',
          600: '#181A22',
        },
        neon: {
          cyan: '#22d3ee',
          violet: '#8b5cf6',
          pink: '#e879f9',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}