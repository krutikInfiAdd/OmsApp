export interface BaseResponse<T> {
  result: T | null;
  isSuccess: boolean;
  message: string | null;
  errors: string[] | null;
  responseStatusCode: number;
  responseStatusValue: string;
}

export interface PaginationBaseResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  result: T[];
  isSuccess: boolean;
  message: string | null;
  errors: string | null;
  responseStatusCode: number;
  responseStatusValue: string;
}
