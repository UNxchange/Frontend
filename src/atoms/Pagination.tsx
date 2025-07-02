import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false
}) => {
  // Función para cambiar de página
  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  // Siempre mostrar la paginación
  const renderPagination = () => {
    const pages = []
    
    // Botón anterior
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className={`pagination-btn pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
      >
        ‹
      </button>
    )

    // Mostrar hasta 5 páginas
    const maxButtons = 5
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + maxButtons - 1)
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    // Agregar páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={disabled}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    // Botón siguiente
    pages.push(
      <button
        key="next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className={`pagination-btn pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
      >
        ›
      </button>
    )

    return pages
  }

  return (
    <div id="pagination" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      {renderPagination()}
    </div>
  )
}

export default Pagination
