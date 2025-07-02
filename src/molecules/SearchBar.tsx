import React from 'react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  showFilterDropdown?: boolean
  onToggleFilter?: () => void
  filterDropdownContent?: React.ReactNode
  isSearching?: boolean
  onClearSearch?: () => void
  hasActiveFilters?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = "Buscar universidades...",
  showFilterDropdown = false,
  onToggleFilter,
  filterDropdownContent,
  isSearching = false,
  onClearSearch,
  hasActiveFilters = false
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
    <div className="search-container">
      <span className="search-icon">
        {isSearching ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-search"></i>
        )}
      </span>
      <input
        type="text"
        className="search-bar"
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
      {onToggleFilter && (
        <button 
          className={`filter-dropdown-toggle ${hasActiveFilters ? 'has-active-filters' : ''}`}
          onClick={onToggleFilter}
          title={hasActiveFilters ? 'Filtros activos - Click para ver/editar' : 'Mostrar filtros'}
          type="button"
        >
          <i className="fas fa-filter"></i>
        </button>
      )}
      {showFilterDropdown && filterDropdownContent && (
        <div className="filters-dropdown" style={{ display: 'block' }}>
          {filterDropdownContent}
        </div>
      )}
    </div>
  )
}

export default SearchBar
