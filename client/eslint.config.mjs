import typescriptEslint from "@typescript-eslint/eslint-plugin";
import noNull from "eslint-plugin-no-null";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends(
        "next/core-web-vitals",
        "plugin:tailwindcss/recommended",
    ),
    {
        ignores: ["node_modules", ".next", "out"],
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "no-null": noNull,
        },
        rules: {
            indent: ["error", 2],
            "react/prop-types": 0,
            "semi": ["error", "always"],
            "@typescript-eslint/no-unused-vars": ["error"],
            "no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
            "import/order": ["error", {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    ["parent", "sibling"],
                    "object",
                    "type",
                    "index",
                ],

                pathGroups: [{
                    pattern: "react",
                    group: "external",
                    position: "before",
                }],

                pathGroupsExcludedImportTypes: ["react", "next"],
                "newlines-between": "always",

                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            }],

            "sort-imports": ["error", {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                allowSeparatedGroups: true,
            }],

            "tailwindcss/no-custom-classname": ["error", {
                config: "./tailwind.config.js",
                replaceWithPredefined: true,
            }],

            "no-trailing-spaces": "error",
            "no-multi-spaces": "error",
            "space-before-blocks": "error",

            "no-multiple-empty-lines": ["error", {
                max: 1,
                maxEOF: 1,
            }],

            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "no-null/no-null": 2,
            curly: ["error", "multi-line", "consistent"],
            "nonblock-statement-body-position": ["error", "beside"],
        },
    },
];