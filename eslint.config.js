import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue", "**/*.js", "**/*.cjs"],
    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
  prettier,
];
