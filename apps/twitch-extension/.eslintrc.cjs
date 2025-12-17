/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: [
    '@idriss-xyz/eslint-config/base',
  ],
  overrides: [
    {
      files: [
        '*.stories.tsx',
        'vite.config.ts',
        'next.config.ts',
        'next-env.d.ts',
        '**/*.cjs',
        '**/*.mjs',
        '**/.*.cjs',
        '**/.*.mjs',
        '**/*.d.ts',
        'src/app/**/*',
        'src/components/**/*',
      ],
      rules: {
        'import/no-default-export': 'off',
        'unicorn/prevent-abbreviations': 'off',
      },
    },
  ],
};
