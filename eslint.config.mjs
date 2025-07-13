import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Custom rule to restrict Prisma imports to data access layer
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message:
                "Direct Prisma imports are not allowed. Use the data access layer from @/data instead.",
            },
          ],
          patterns: [
            {
              group: ["**/lib/prisma*"],
              message:
                "Direct Prisma imports are not allowed. Use the data access layer from @/data instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/data/**/*", "src/lib/prisma.ts", "prisma/**/*"],
    rules: {
      // Allow Prisma imports only in data access layer and lib/prisma
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
