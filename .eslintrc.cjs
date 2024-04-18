const { resolve } = require('node:path');
const project = resolve(process.cwd(), 'tsconfig.eslint.json');

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2022,
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
    'plugin:boundaries/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier',
    'plugin:prettier/recommended',
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
    'boundaries/elements': [
      {
        type: 'shared',
        pattern: 'src/shared/*',
        capture: ['module'],
      },
      {
        type: 'infrastructure',
        pattern: 'src/infrastructure/*',
      },
      {
        type: 'runtime',
        pattern: 'src/runtime/*',
      },

      {
        type: 'application',
        pattern: 'src/application/*',
        capture: ['applicationName'],
      },
    ],
    'boundaries/include': ['src/**/*.ts', 'src/**/*.tsx'],
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
    'tailwindcss/classnames-order': 'off',
    'boundaries/element-types': [
      2,
      {
        // disallow importing any element by default
        default: 'disallow',
        rules: [
          {
            from: [['shared', { module: 'ui' }]],
            allow: [['shared', { module: 'ui' }]],
          },
          {
            from: [['shared', { module: 'monitoring' }]],
            allow: [['shared', { module: 'monitoring' }]],
          },

          {
            from: [['shared', { module: 'messaging' }]],
            allow: [['shared', { module: 'messaging' }]],
          },
          {
            from: [
              ['shared', { module: '!messaging' }],
              ['shared', { module: '!ui' }],
            ],
            allow: [
              ['shared', { module: 'ui' }],
              ['shared', { module: 'messaging' }],
              ['shared', { module: '${this.module}' }],
            ],
          },
          {
            from: ['application'],
            allow: [
              ['application', { applicationName: '${this.applicationName}' }],
              'shared',
            ],
          },
          {
            from: ['infrastructure'],
            allow: ['application', 'shared'],
          },
          {
            from: ['runtime'],
            allow: ['infrastructure'],
          },
        ],
      },
    ],

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
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
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
