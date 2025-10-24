/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: ['@idriss-xyz/eslint-config/base'],
  overrides: [
    {
      files: ['src/migrations/**/*.{ts,js}', 'src/**/*.ts'],
      rules: {
        'unicorn/filename-case': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/no-array-reduce': 'off',
      },
    },
  ],
};
