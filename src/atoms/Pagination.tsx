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

  // Renderizar la paginación
  const renderPagination = () => {
    const pages = []
    
    // Botón anterior
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className={`pagination-btn pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        title="Página anterior"
      >
        ‹
      </button>
    )

    // Lógica mejorada para mostrar páginas
    const maxButtons = 7 // Aumentamos a 7 para mejor navegación
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxButtons) {
      // Si hay muchas páginas, mostrar solo un subconjunto
      const halfButtons = Math.floor(maxButtons / 2)
      
      if (currentPage <= halfButtons) {
        // Cerca del inicio
        startPage = 1
        endPage = maxButtons
      } else if (currentPage >= totalPages - halfButtons) {
        // Cerca del final
        startPage = totalPages - maxButtons + 1
        endPage = totalPages
      } else {
        // En el medio
        startPage = currentPage - halfButtons
        endPage = currentPage + halfButtons
      }
    }

    // Agregar primera página y puntos suspensivos si es necesario
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          disabled={disabled}
          className={`pagination-btn ${1 === currentPage ? 'active' : ''}`}
        >
          1
        </button>
      )
      
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="pagination-ellipsis">
            ...
          </span>
        )
      }
    }

    // Agregar páginas principales
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 && startPage > 1) continue // Ya agregamos la primera página
      
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={disabled}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          title={`Página ${i}`}
        >
          {i}
        </button>
      )
    }

    // Agregar puntos suspensivos y última página si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="pagination-ellipsis">
            ...
          </span>
        )
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled}
          className={`pagination-btn ${totalPages === currentPage ? 'active' : ''}`}
        >
          {totalPages}
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
        title="Página siguiente"
      >
        ›
      </button>
    )

    return pages
  }

  return (
    <div className="pagination-numbers">
      {renderPagination()}
    </div>
  )
}

export default Pagination
