const { resolve } = require('node:path');
const project = resolve(process.cwd(), 'tsconfig.eslint.json');

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: project,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:tailwindcss/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:storybook/recommended',
    'prettier',
  ],
  settings: {
    'react': {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project,
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    {
      files: [
        '*.stories.tsx',
        'vite.config.ts',
        '**/*.cjs',
        '**/*.mjs',
        '**/.*.cjs',
        '**/.*.mjs',
        '**/*.d.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  rules: {
    'unicorn/prefer-global-this': 'off',
    'tailwindcss/classnames-order': 'off',
    'arrow-body-style': ['error', 'always'],
    'react/prop-types': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'react/jsx-curly-brace-presence': ['warn', 'never'],
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
    '@tanstack/query/exhaustive-deps': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off', // TODO: enable and fix issuess
    '@typescript-eslint/no-unsafe-argument': 'off', // TODO: enable and fix issuess
    '@typescript-eslint/no-unsafe-assignment': 'off', // TODO: enable and fix issuess
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off', // TODO: ['error', 'type']
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'import/namespace': 'off', // turned off because this rule is slow
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
};
