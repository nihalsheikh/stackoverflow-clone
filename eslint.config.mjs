import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tailwindcss from "eslint-plugin-tailwindcss";
import simpleImportSort from "eslint-plugin-simple-import-sort";

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
		// Eslint plugin -> Import sorting
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
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
						// Relative imports
						[
							"^\\.\\.(?!/?$)",
							"^\\.\\./?$",
							"^\\./(?=.*/)(?!/?$)",
							"^\\.(?!/?$)",
							"^\\./?$",
						],
						// Style imports
						["^.+\\.s?css$"],
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
