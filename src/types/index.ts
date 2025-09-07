export type PropsWithClassName<T = unknown> = T & { className?: string };

export type Pagination<T extends Array<any>> = {
  page: number;
  limit: number;
  total: number;
  content: T;
  totalPages: number;
};
