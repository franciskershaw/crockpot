/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    // React imports first (for Next.js frontend)
    "^(react/(.*)$)|^(react$)",
    "^(react-dom/(.*)$)|^(react-dom$)",

    "",
    // Next.js imports
    "^(next/(.*)$)|^(next$)",

    "",
    // Hono framework imports (for API)
    "^(hono/(.*)$)|^(hono$)",
    "^@hono/(.*)$",

    "",
    // Prisma and database
    "^@prisma/(.*)$",

    "",
    // Other third-party libraries
    "<THIRD_PARTY_MODULES>",

    "",
    // Shared/monorepo internal packages
    "^@shared/(.*)$",

    "",
    // Aliased imports (Next.js @ alias)
    "^@/(.*)$",

    "",
    // Absolute imports from src
    "^src/(.*)$",

    "",
    // Style imports
    "^.+\\.s?css$",

    "",
    // Relative imports (parent directories)
    "^\\.\\.(?!/?$)",
    "^\\.\\./?$",

    "",
    // Relative imports (current directory)
    "^\\./(?=.*/)(?!/?$)",
    "^\\.(?!/?$)",
    "^\\./?$",
  ],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
