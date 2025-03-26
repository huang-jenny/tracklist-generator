/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        color_background: {
          DEFAULT: '#F4E2D4'
        },
        color_text: {
          DEFAULT: '#DA687F'
        }
      }
    }
  },
  plugins: []
};
