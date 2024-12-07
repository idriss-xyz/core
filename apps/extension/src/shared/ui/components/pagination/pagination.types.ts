export interface Pagination {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export interface PaginationComponentProperties {
  pagination: Pagination;
  buttonClassNames?: string;
}
