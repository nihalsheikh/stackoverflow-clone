import { FlatCompat } from "@eslint/eslintrc";
import tailwindcss from "eslint-plugin-tailwindcss";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  ...tailwindcss.configs["flat/recommended"], // newly added tailwindcss plugin
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    //  Rules for sorting
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React and Next.js come first
            ["^react", "^next"],
            // Other external packages
            ["^@?\\w"],
            // Absolute imports from your project (e.g., @/components)
            ["^@/"],
            // Pin globals.css group first (match only your app/globals.css)
            ["^app/globals\\.css$"],
            // Pin prism.css group second (match only your styles/prism.css)
            ["^styles/prism\\.css$"],
            // All other style imports (catch-all for other css/scss)
            ["^.+\\.s?css$"],
            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Side effect imports
            ["^\\u0000"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
];

export default eslintConfig;
