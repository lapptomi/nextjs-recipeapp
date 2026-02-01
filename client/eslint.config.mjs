import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // ← Disables ESLint rules that conflict with Prettier
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts"
  ]),
  // Add custom rules here
  {
    plugins: {
      prettier: prettierPlugin, // ← Register Prettier plugin
    },
    rules: {
      // Allow any types
      "@typescript-eslint/no-explicit-any": "off",
      // Disable ESLint's own comma rules (let Prettier handle it)
      "comma-dangle": "off",
      "@typescript-eslint/comma-dangle": "off",
      // Run Prettier as an ESLint rule
      "prettier/prettier": "error"
    },
  },
]);

export default eslintConfig;
