import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginCompat from 'eslint-plugin-compat';
import pluginPromise from 'eslint-plugin-promise';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      pluginStylistic.configs.customize({
        semi: true,
        braceStyle: '1tbs',
      }),
      pluginPromise.configs['flat/recommended'],
      pluginCompat.configs['flat/recommended'],
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
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
  },
  {
    // Disable type checking for test files
    extends: [
      tseslint.configs.disableTypeChecked,
    ],
    files: [
      '**/*.test.{js,jsx}',
    ],
  },
);
