export const mode =
  process?.argv?.find((arg) => arg.includes('--mode'))?.split('=')?.[1] ||
  'production';
