import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UsePaginationOptions {
  pageSize: number
  /** URL query param holding the 1-based page. Defaults to `page`. */
  param?: string
}

/**
 * Page state for a paginated list, kept in the URL (`?page=2`) so a page
 * survives a refresh and can be shared. Page 1 is the absence of the param.
 * Pair with the query's `pageCount` and the Pagination component.
 */
export function usePagination({ pageSize, param = 'page' }: UsePaginationOptions) {
  const [searchParams, setSearchParams] = useSearchParams()
  const parsed = Number.parseInt(searchParams.get(param) ?? '', 10)
  const page = Number.isFinite(parsed) && parsed > 1 ? parsed : 1

  const setPage = useCallback(
    (next: number) => {
      setSearchParams((previous) => {
        const params = new URLSearchParams(previous)
        if (next > 1) {
          params.set(param, String(next))
        } else {
          params.delete(param)
        }
        return params
      })
    },
    [param, setSearchParams],
  )

  return { page, pageSize, setPage, param }
}
