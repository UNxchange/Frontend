import React, { useState } from 'react'
import '../atoms/filter-panel.css'

interface FilterPanelProps {
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
  isVisible: boolean
  onToggleVisibility: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  countries,
  languages,
  states,
  agreementTypes,
  subscriptionLevels,
  validityOptions,
  subscriptionYears,
  filters,
  onFilterChange,
  onClearFilters,
  isVisible,
  onToggleVisibility
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const createFilterSection = (
    id: string,
    title: string,
    options: string[],
    value: string,
    placeholder: string
  ) => {
    const isCollapsed = collapsedSections[id]
    const hasValue = value !== ''
    
    return (
      <div className="filter-section" key={id}>
        <div 
          className="filter-section-header"
          onClick={() => toggleSection(id)}
        >
          <div className="filter-section-title">
            <span>{title}</span>
            {hasValue && <span className="filter-active-indicator"></span>}
          </div>
          <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'} filter-chevron`}></i>
        </div>
        
        {!isCollapsed && (
          <div className="filter-section-content">
            <select
              value={value}
              onChange={(e) => onFilterChange(id, e.target.value)}
              className="filter-select"
            >
              <option value="">{placeholder}</option>
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <div className={`filter-panel ${isVisible ? 'visible' : ''}`}>
      <div className="filter-panel-header">
        <div className="filter-panel-title">
          <i className="fas fa-filter"></i>
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </div>
        <div className="filter-panel-actions">
          {hasActiveFilters && onClearFilters && (
            <button 
              onClick={onClearFilters}
              className="clear-filters-btn"
              type="button"
              title="Limpiar todos los filtros"
            >
              <i className="fas fa-times"></i>
              <span>Limpiar</span>
            </button>
          )}
          <button 
            onClick={onToggleVisibility}
            className="close-panel-btn"
            type="button"
            title="Cerrar panel de filtros"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="filter-panel-content">
        {createFilterSection('country', 'País', countries, filters.country, 'Todos los países')}
        {createFilterSection('language', 'Idioma', languages, filters.language, 'Todos los idiomas')}
        {createFilterSection('state', 'Estado', states, filters.state, 'Todos los estados')}
        {createFilterSection('agreement_type', 'Tipo de Acuerdo', agreementTypes, filters.agreement_type, 'Todos los tipos')}
        {createFilterSection('subscription_level', 'Dependencia', subscriptionLevels, filters.subscription_level, 'Todas las dependencias')}
        {createFilterSection('validity', 'Vigencia', validityOptions, filters.validity, 'Todas las vigencias')}
        {createFilterSection('subscription_year', 'Año de Suscripción', subscriptionYears, filters.subscription_year, 'Todos los años')}
      </div>

      {hasActiveFilters && (
        <div className="filter-panel-footer">
          <div className="active-filters-summary">
            <span>Filtros activos: {activeFiltersCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
