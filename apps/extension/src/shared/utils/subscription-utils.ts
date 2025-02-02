/**
 * Returns if text is farcaster name
 */
export const isFarcasterName = (text: string) => {
  const farcasterPattern = /^[^.]+$/;

  return farcasterPattern.test(text);
};
