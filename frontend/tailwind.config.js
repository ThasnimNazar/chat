/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbarWidth: {
        none: 'none',
      },
      scrollbar: {
        'hide': {
          'overflow': 'hidden',
        }
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [  
  ],
};