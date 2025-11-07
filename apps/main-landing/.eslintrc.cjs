/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    '@idriss-xyz/eslint-config/base',
  ],
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
        'src/app/**/*',
        'src/components/**/*',
      ],
      rules: {
        'import/no-default-export': 'off',
        '@next/next/no-img-element': 'off',
        'tailwindcss/no-custom-classname': 'off',
      },
    },
  ],
};
