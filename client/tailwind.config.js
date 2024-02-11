/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			boxShadow: {
				navTop: '3px 2px 6px 0px rgba(0, 0, 0, 0.2)',
				navBottom: '3px -2px 6px 0px rgba(0, 0, 0, 0.2)',
				DEFAULT: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				hover: 'rgba(100, 100, 111, 0.4) 0px 7px 29px 0px',
			},
		},
		colors: {
			yellow: {
				light: '#f3ecdc',
				// DEFAULT: '#fabd1e',
				DEFAULT: '#1d873c',
			},
			green: {
				light: '#f1ffe8',
				DEFAULT: '#1d873c',
			},

			background: {
				light: 'rgba(34,34,34,0.10)',
				main: '#f3ecdc',
				overlay: 'rgba(34,34,34,0.50)',
			},
			borderLight: 'rgba(34,34,34,0.25)',
			borderDark: 'rgba(34,34,34,0.50)',

			disabled: '#BDBDBD',
			white: '#f8f8ff',
			black: {
				DEFAULT: 'rgba(34,34,34,1)',
				25: 'rgba(34,34,34,0.25)',
				50: 'rgba(34,34,34,0.5)',
				75: 'rgba(34,34,34,0.75)',
			},

			primary: {
				light: '#f1ffe8',
				DEFAULT: '#1d873c',
			},
			secondary: {
				DEFAULT: '#F57C00',
			},
			tertiary: {
				DEFAULT: '#fabd1e',
			},
			error: {
				DEFAULT: '#ff0033',
			},
			blue: {
				light: '#efecf7',
			},
			body: {
				light: '#fef7f1',
				DEFAULT: '#391e67',
			},
			transparent: 'transparent',
		},
		fontFamily: {
			title: 'Caprasimo',
			body: 'Lato',
		},
		zIndex: {
			back: -1,
			modalHeader: 15,
			searchBar: 15,
			addRecipe: 20,
			navBottom: 20,
			navTop: 25,
			navHamburger: 30,
			modalOverlay: 35,
			modal: 40,
			modalOverlayNested: 45,
			modalNested: 50,
		},
		screens: {
			xs: '440px',
			// => @media (min-width: 440px) { ... }

			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }
		},
	},
	plugins: [require('tailwindcss'), require('autoprefixer')],
};
