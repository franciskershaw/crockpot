module.exports = {
	tabWidth: 2,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	importOrder: [
		'^react', // React
		'^react-icons', // React Icons
		'^next/', // Next.js
		'^(?![.@]/src/)', // Packages
		'^@/src/types/', // Global types
		'^\\./types/', // Local types
		'^@/src/hooks/', // Global hooks
		'^\\./hooks/', // Local hooks
		'^@/src/context/', // Global context
		'^\\./context/', // Local context
		'^@/src/components/', // Global components
		'^\\./components/', // Local components
		'^@/src/styles/globals.scss', // Global styles
		'^\\./styles.scss', // Local styles
		'^\\./',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	plugins: ['@trivago/prettier-plugin-sort-imports'],
};
