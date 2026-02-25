/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron:    '#E8721C',
        'saf-dark': '#C05A10',
        turmeric:   '#F2A830',
        ivory:      '#FDF6EC',
        parchment:  '#F0E6D0',
        maroon:     '#7B1C2E',
        'mar-light':'#A63246',
        forest:     '#2C5F2E',
        mud:        '#6B4C35',
        'mud-light':'#9B7355',
        ink:        '#1C1410',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        hind:  ['"Hind"', 'sans-serif'],
        body:  ['"Poppins"', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dipDip: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(7px)' },
        },
      },
      animation: {
        'fade-1': 'fadeUp 0.8s 0.1s both',
        'fade-2': 'fadeUp 0.8s 0.3s both',
        'fade-3': 'fadeUp 0.8s 0.5s both',
        'fade-4': 'fadeUp 0.8s 0.7s both',
        'dip':    'dipDip 2s infinite',
      },
    },
  },
  plugins: [],
}
