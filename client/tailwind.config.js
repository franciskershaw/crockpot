/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		boxShadow: {
			navTop: '3px 2px 6px 0px rgba(0, 0, 0, 0.2)',
			navBottom: '3px -2px 6px 0px rgba(0, 0, 0, 0.2)',
			DEFAULT: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
			hover: 'rgba(100, 100, 111, 0.4) 0px 7px 29px 0px',
		},
		colors: {
			primary: {
				DEFAULT: '#167935',
			},
			secondary: {
				DEFAULT: '#F57C00',
			},
			tertiary: {
				DEFAULT: '#fabd1e',
			},
			white: '#feffff',
			blue: {
				light: '#efecf7',
			},
			disabled: '#BDBDBD',
			body: {
				light: '#fef7f1',
				DEFAULT: '#391e67',
			},
			black: {
				DEFAULT: 'rgba(34,34,34,1)',
				25: 'rgba(34,34,34,0.25)',
				50: 'rgba(34,34,34,0.5)',
				75: 'rgba(34,34,34,0.75)',
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
			navBottom: 20,
			navTop: 25,
			navHamburger: 30,
			modalOverlay: 35,
			modal: 40,
		},
	},
	plugins: [require('tailwindcss'), require('autoprefixer')],
};
