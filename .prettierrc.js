module.exports = {
	tabWidth: 2,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	importOrder: [
		'^react', // React
		'^react-icons', // React Icons
		'^next/', // Next.js
		'<THIRD_PARTY_MODULES>', // Third-party modules
		'.*/types/', // Types
		'.*/hooks/', // Hooks
		'.*/context/', // Context
		'.*/components/', // Components
		'.*\\.scss$', // Styles
		'^\\./', // Other local imports
		'^[./]', // Catch-all for remaining imports
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	plugins: ['@trivago/prettier-plugin-sort-imports'],
};
