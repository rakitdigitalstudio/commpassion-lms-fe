/** One page of a paginated list, plus where it sits in the whole result. */
export interface Page<T> {
  items: T[]
  /** 1-based. */
  page: number
  pageSize: number
  pageCount: number
  total: number
}

/** Strapi v5 `meta.pagination` (page-based). */
export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}
