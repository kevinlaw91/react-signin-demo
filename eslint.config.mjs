/* eslint-disable
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
*/

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { fixupPluginRules } from '@eslint/compat';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginPromise from 'eslint-plugin-promise';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import configReactRecommended from 'eslint-plugin-react/configs/recommended.js';
import configReactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import compat from 'eslint-plugin-compat';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  pluginStylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
  }),
  configReactRecommended,
  configReactJSXRuntime,
  {
    name: 'react-hook/recommended',
    plugins: {
      'react-hooks': fixupPluginRules(pluginReactHooks),
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  pluginPromise.configs['flat/recommended'],
  {
    plugins: {
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
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
      '@typescript-eslint/no-unused-vars': ['error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'promise/catch-or-return': ['error',
        {
          allowFinally: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  compat.configs['flat/recommended'],
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
  {
    files: [
      '**/*.test.js',
      '**/*.test.jsx',
    ],
    ...tseslint.configs.disableTypeChecked,
  },
);
