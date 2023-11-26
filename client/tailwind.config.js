/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		boxShadow: {
			navTop: '0 5px 8px -2px rgba(0, 0, 0, 0.4)',
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
				50: 'rgba(34,34,34,0.5)',
				60: 'rgba(34,34,34,0.6)',
				70: 'rgba(34,34,34,0.7)',
				80: 'rgba(34,34,34,0.8)',
				90: 'rgba(34,34,34,0.9)',
			},
			transparent: 'transparent',
		},
		fontFamily: {
			title: 'Caprasimo',
			body: 'Lato',
		},
		zIndex: {
			nav: 20,
		},
	},
	plugins: [require('tailwindcss'), require('autoprefixer')],
};
