export type LookupFormValues = {
  identifier: string;
};

export type SearchResult = {
  identifier: string;
  lookup: Record<string, string>;
};
