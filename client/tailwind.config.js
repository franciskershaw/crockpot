/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#167935',
				},
				secondary: {
					DEFAULT: '#F57C00',
				},
				yellow: '#fabd1e',
				white: '#feffff',
				blue: {
					light: '#efecf7',
				},
				disabled: '#BDBDBD',
				body: {
					light: '#fef7f1',
					DEFAULT: '#391e67',
				},
				black: '#222222',
			},
			fontFamily: {
				title: 'Caprasimo',
				body: 'Lato',
			},
		},
	},
	plugins: [require('tailwindcss'), require('autoprefixer')],
};
