import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
}

interface PaginationState {
  currentPage: number
  limit: number
  skip: number
}

interface UsePaginationReturn {
  paginationState: PaginationState
  goToPage: (page: number) => void
  changeLimit: (newLimit: number) => void
  nextPage: () => void
  prevPage: () => void
  resetPagination: () => void
  getPaginationFilters: () => { limit: number; skip: number }
}

export const usePagination = ({ 
  initialPage = 1, 
  initialLimit = 20 
}: UsePaginationProps = {}): UsePaginationReturn => {
  
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: initialPage,
    limit: initialLimit,
    skip: (initialPage - 1) * initialLimit
  })

  const goToPage = useCallback((page: number) => {
    setPaginationState(prev => ({
      ...prev,
      currentPage: page,
      skip: (page - 1) * prev.limit
    }))
  }, [])

  const changeLimit = useCallback((newLimit: number) => {
    setPaginationState(prev => ({
      currentPage: 1,
      limit: newLimit,
      skip: 0
    }))
  }, [])

  const nextPage = useCallback(() => {
    setPaginationState(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      skip: prev.currentPage * prev.limit
    }))
  }, [])

  const prevPage = useCallback(() => {
    setPaginationState(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
      skip: Math.max(0, (prev.currentPage - 2) * prev.limit)
    }))
  }, [])

  const resetPagination = useCallback(() => {
    setPaginationState({
      currentPage: initialPage,
      limit: initialLimit,
      skip: (initialPage - 1) * initialLimit
    })
  }, [initialPage, initialLimit])

  const getPaginationFilters = useCallback(() => ({
    limit: paginationState.limit,
    skip: paginationState.skip
  }), [paginationState.limit, paginationState.skip])

  return {
    paginationState,
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
    resetPagination,
    getPaginationFilters
  }
}

export default usePagination
