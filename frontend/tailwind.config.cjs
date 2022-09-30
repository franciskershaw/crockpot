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
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        h1: ['32px', {
          lineHeight: '32px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h2: ['28px', {
          lineHeight: '30px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h3: ['24px', {
          lineHeight: '26px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h4: ['20px', {
          lineHeight: '28px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h5: ['16px', {
          lineHeight: '24px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h6: ['14px', {
          lineHeight: '22px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        body: ['16px', {
          lineHeight: '24px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h1-md': ['64px', {
          lineHeight: '64px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h2-md': ['48px', {
          lineHeight: '54px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h3-md': ['32px', {
          lineHeight: '36px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h4-md': ['28px', {
          lineHeight: '40px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h5-md': ['22px', {
          lineHeight: '32px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'h6-md': ['18px', {
          lineHeight: '28px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'body-md': ['22px', {
          lineHeight: '32px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
      },
      zIndex: {
        'nav': 10,
        'modal': 20
      }
    },
  },
  plugins: [],
};
