import crypto from 'crypto';

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Returns true if the strings are equal, false otherwise.
 */
export const timingSafeEqual = (
  a: string | undefined,
  b: string | undefined,
): boolean => {
  if (!a || !b) return false;

  // Ensure both strings are the same length to prevent length-based timing attacks
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Compare against itself to maintain constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
};
