/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 0 0.5rem rgba(0, 0, 0, 0.2)',
        top: '0 -5px 15px rgb(51 61 71 / 35%)',
        bottom: '0 5px 15px rgb(51 61 71 / 35%)',
      },
    },
  },
  plugins: [],
};
