import React from 'react'

interface FilterDropdownProps {
  countries: string[]
  languages: string[]
  states: string[]
  agreementTypes: string[]
  subscriptionLevels: string[]
  validityOptions: string[]
  subscriptionYears: string[]
  filters: {
    country: string
    language: string
    state: string
    agreement_type: string
    subscription_level: string
    validity: string
    subscription_year: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters?: () => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  countries,
  languages,
  states,
  agreementTypes,
  subscriptionLevels,
  validityOptions,
  subscriptionYears,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const createFilterSelect = (
    id: string,
    label: string,
    options: string[],
    value: string
  ) => (
    <div className="filter-dropdown" key={id}>
      <label htmlFor={id} className="filter-label">{label}:</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onFilterChange(id, e.target.value)}
        className="filter-select"
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h4>Filtros de búsqueda</h4>
        {hasActiveFilters && onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="clear-filters-btn"
            type="button"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      
      <div className="filters">
        {createFilterSelect('country', 'País', countries, filters.country)}
        {createFilterSelect('language', 'Idioma', languages, filters.language)}
        {createFilterSelect('state', 'Estado', states, filters.state)}
        {createFilterSelect('agreement_type', 'Tipo de Acuerdo', agreementTypes, filters.agreement_type)}
        {createFilterSelect('subscription_level', 'Dependencia', subscriptionLevels, filters.subscription_level)}
        {createFilterSelect('validity', 'Vigencia', validityOptions, filters.validity)}
        {createFilterSelect('subscription_year', 'Año de Suscripción', subscriptionYears, filters.subscription_year)}
      </div>
      
      {hasActiveFilters && (
        <div className="active-filters-summary">
          <span className="active-filters-count">
            {Object.values(filters).filter(value => value !== '').length} filtro(s) activo(s)
          </span>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
