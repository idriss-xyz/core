/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: [
    '@idriss-xyz/eslint-config/base',
    'plugin:boundaries/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
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
      {
        type: 'asset',
        pattern: 'src/assets/*',
      },
    ],
    'boundaries/include': ['src/**/*.ts', 'src/**/*.tsx'],
  },
  rules: {
    'boundaries/no-unknown-files': [2],
    'boundaries/entry-point': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            target: [
              'shared',
              'host',
              'application',
              'infrastructure',
              'final',
              'asset',
            ],
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
            from: ['*'],
            allow: ['asset'],
          },
          {
            from: ['runtime'],
            allow: ['infrastructure', 'shared'],
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
            allow: ['application', 'shared', 'host'],
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
  },
};
