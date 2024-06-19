const stylistic = require('@stylistic/eslint-plugin');

// ESLint Stylistic config
const stylisticCustom = stylistic.configs.customize({
  semi: true,
  braceStyle: '1tbs',
});

module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@stylistic',
  ],
  rules: {
    ...stylisticCustom.rules,
  },
};
