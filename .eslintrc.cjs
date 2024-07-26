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
    project: project,
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
    'plugin:storybook/recommended',
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
        type: 'runtime',
        pattern: 'src/runtime/*',
      },
      {
        type: 'final',
        pattern: ['src/final/index.ts', 'src/final', 'src/final/*'],
      },
      {
        type: 'infrastructure',
        pattern: 'src/infrastructure/*',
        capture: ['infrastructureElement'],
      },
      ,
      {
        type: 'application',
        pattern: ['src/application/*'],
        capture: ['applicationName'],
      },
      {
        type: 'host',
        pattern: 'src/host/*',
        capture: ['hostName'],
      },
      {
        type: 'shared',
        pattern: 'src/shared/*',
        capture: ['moduleName'],
      },
      {
        type: 'types',
        pattern: 'src/types',
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
    'boundaries/no-unknown-files': [2],
    'boundaries/entry-point': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            target: ['shared', 'host', 'application', 'infrastructure', 'final'],
            allow: 'index.(ts|tsx)',
          },
        ],
      },
    ],
    'boundaries/element-types': [
      2,
      {
        // disallow importing any element by default
        default: 'disallow',
        rules: [
          {
            from: ['runtime'],
            allow: ['infrastructure'],
          },
          {
            from: ['host'],
            allow: ['shared'],
          },
          {
            from: ['shared'],
            allow: ['shared'],
          },
          {
            from: ['infrastructure'],
            allow: ['application', 'host', 'shared', 'final'],
          },
          {
            from: ['final'],
            allow: [
              'application',
              'shared',
              'host',
            ],
          },
          {
            from: ['application'],
            allow: [
              ['application', { applicationName: '${this.applicationName}' }],
              'shared',
              'host',
            ],
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
