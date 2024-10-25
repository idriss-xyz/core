/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'twMerge', 'cva', 'classes'],
  tailwindConfig: './packages/tailwind-config/tailwind.config.mjs',
  singleQuote: true,
  quoteProps: 'consistent',
  trailingComma: 'all',
  useTabs: false,
  endOfLine: 'auto',
  semi: true,
  tabWidth: 2,
  printWidth: 80,
  arrowParens: 'always',
  bracketSpacing: true,
};
