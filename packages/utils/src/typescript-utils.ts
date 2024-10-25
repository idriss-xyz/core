export type FullyRequired<T extends object> = {
  [P in keyof T]-?: Required<NonNullable<T[P]>>;
};
