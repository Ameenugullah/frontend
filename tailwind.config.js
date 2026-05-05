/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        script:  ['"Great Vibes"', 'cursive'],
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream:   { 50: '#faf8f5', 100: '#f5f0e8', 200: '#ede4d3' },
        sand:    { 100: '#f0ebe2', 200: '#e0d8cc', 300: '#c8bfb0' },
        blush:   { 50: '#fdf4f4', 100: '#fce8e8', 400: '#e8a0a0', 500: '#d97070', 600: '#c45555' },
        charcoal:{ 700: '#4a4a4a', 800: '#2c2c2c', 900: '#1a1a1a' },
        gold:    { 400: '#d4a843', 500: '#c49a2e', 600: '#a8821a' },
        navy:    { 800: '#1a2744', 900: '#0f1829' },
      },
      boxShadow: {
        soft:  '0 2px 20px rgba(0,0,0,0.06)',
        card:  '0 4px 30px rgba(0,0,0,0.08)',
        lift:  '0 8px 40px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease forwards',
        'fade-up':  'fadeUp 0.6s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-10px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
