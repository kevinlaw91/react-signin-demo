module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    "eslint:recommended",
    "semistandard",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react-refresh"
  ],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "react-refresh/only-export-components": "warn",
  },
};
