/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      'sm': '0.5rem',
      DEFAULT: '1rem',
      'lg': '2rem',
      'full': '9999px'
    },
    extend: {
      boxShadow: {
        DEFAULT: '0 0 0.5rem rgba(0, 0, 0, 0.2)',
        card: '0 13px 27px -5px rgb(51 61 71 / 25%), 0 8px 16px -8px rgb(51 61 71 / 30%);',
        top: '0 -5px 15px rgb(51 61 71 / 35%)',
        bottom: '0 5px 15px rgb(51 61 71 / 35%)',
      },
      colors: {
        white: '#fff',
        grey: {
          'bg': '#eee',
          'inactive': '#b0b0b0'
        },
        black: '#333d47',
        purple: '#3e3ac2',
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
          lineHeight: '24px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        h5: ['16px', {
          lineHeight: '20px',
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
      scale: {
        'sm': '1.025',
        'lg': '1.05',
      },
      transitionDuration: {
        'sm': '400ms',
        'md': '600ms',
        'lg': '1000ms',
      },
      zIndex: {
        '1': 1,
        'nav': 20,
        'modal': 30
      }
    },
  },
  plugins: [],
};
