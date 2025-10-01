import React from 'react'
import SearchBar from '../molecules/SearchBar'
import FilterDropdown from '../molecules/FilterDropdown'

interface FiltersOrganismProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  showFilterDropdown: boolean
  onFilterToggle: () => void
  onFilterChange: (filterType: string, value: string) => void
  filterOptions: {
    countries: string[]
    languages: string[]
    states: string[]
    agreementTypes: string[]
    subscriptionLevels: string[]
    validityOptions: string[]
    subscriptionYears: string[]
  }
  currentFilters: {
    country: string
    language: string
    state: string
    agreement_type: string
    subscription_level: string
    validity: string
    subscription_year: string
  }
}

const FiltersOrganism: React.FC<FiltersOrganismProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  showFilterDropdown,
  onFilterToggle,
  onFilterChange,
  filterOptions,
  currentFilters
}) => {
  return (
    <div className="search-container bg-white p-4 shadow-md rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Buscar universidades..."
        />
        
        <div className="relative">
          <button
            onClick={onFilterToggle}
            className="filter-dropdown-toggle p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-filter text-gray-600"></i>
          </button>
          
          {showFilterDropdown && (
            <FilterDropdown
              countries={filterOptions.countries}
              languages={filterOptions.languages}
              states={filterOptions.states}
              agreementTypes={filterOptions.agreementTypes}
              subscriptionLevels={filterOptions.subscriptionLevels}
              validityOptions={filterOptions.validityOptions}
              subscriptionYears={filterOptions.subscriptionYears}
              filters={currentFilters}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FiltersOrganism
