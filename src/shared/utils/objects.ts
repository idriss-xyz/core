export const reverseObject = (
  object: Record<string, string>,
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      return [value, key];
    }),
  );
};

/*
 * Creates lookup obj from const array, should be used instead of typescript enums.
 * */
export const createLookup = <T extends string>(array: readonly T[]) => {
  return Object.fromEntries(
    array.map((item) => {
      return [item, item];
    }),
  ) as { [key in T]: Extract<T, key> };
};
