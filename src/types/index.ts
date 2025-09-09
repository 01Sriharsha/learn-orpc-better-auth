export type PropsWithClassName<T = unknown> = T & { className?: string };

export type Pagination<T extends Array<any>> = {
  page: number;
  pageSize: number;
  total: number;
  content: T;
  totalPages: number;
};
