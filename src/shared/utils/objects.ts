export const reverseObject = (
  object: Record<string, string>,
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      return [value, key];
    }),
  );
};
