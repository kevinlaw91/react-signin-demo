/* eslint-disable
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
*/

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import promise from 'eslint-plugin-promise';
import { fixupPluginRules } from '@eslint/compat';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  stylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
  }),
  reactRecommended,
  reactJsxRuntime,
  {
    name: 'react-hook/recommended',
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  {
    name: 'promise/recommended',
    plugins: {
      promise,
    },
    rules: promise.configs.recommended.rules,
  },
  {
    name: 'Rules',
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: {
          attributes: false,
        },
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
