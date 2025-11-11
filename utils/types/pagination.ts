export interface PaginationMeta {
  count: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}