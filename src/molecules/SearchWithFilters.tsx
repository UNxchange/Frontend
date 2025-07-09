import React from 'react'
import '../atoms/search-with-filters.css'

interface SearchWithFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  isSearching?: boolean
  onClearSearch?: () => void
  hasActiveFilters?: boolean
  onToggleFilters?: () => void
  activeFiltersCount?: number
}

const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = "Buscar universidades...",
  isSearching = false,
  onClearSearch,
  hasActiveFilters = false,
  onToggleFilters,
  activeFiltersCount = 0
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const handleClearSearch = () => {
    onSearchChange('')
    if (onClearSearch) {
      onClearSearch()
    }
  }

  return (
    <div className="search-with-filters-container">
      <div className="search-input-container">
        <span className="search-icon">
          {isSearching ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        {searchTerm && (
          <button 
            className="clear-search-btn" 
            onClick={handleClearSearch}
            disabled={isSearching}
            title="Limpiar búsqueda"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {onToggleFilters && (
        <button 
          className={`filters-toggle-btn ${hasActiveFilters ? 'has-active-filters' : ''}`}
          onClick={onToggleFilters}
          title={hasActiveFilters ? 'Filtros activos - Click para ver/editar' : 'Mostrar filtros'}
          type="button"
        >
          <i className="fas fa-filter"></i>
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="filters-badge">{activeFiltersCount}</span>
          )}
        </button>
      )}
    </div>
  )
}

export default SearchWithFilters
