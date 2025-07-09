import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Organismos
import NavigationBar from '../organisms/NavigationBar'

// Moléculas
import SearchBar from '../molecules/SearchBar'
import SearchWithFilters from '../molecules/SearchWithFilters'
import FilterDropdown from '../molecules/FilterDropdown'
import FilterPanel from '../molecules/FilterPanel'
import UniversityCard, { Universidad } from '../molecules/UniversityCard'
import UniversityPopup from '../molecules/UniversityPopup'

// Componentes
import EditConvocatoriaModal from '../components/EditConvocatoriaModal'

// Átomos
import Button from '../atoms/Button'
import Pagination from '../atoms/Pagination'

// Servicios y tipos
import conveniosService, { UniversidadApi, ConveniosResponse } from '../services/conveniosService'

// Estilos
import '../atoms/navbar.css'
import '../atoms/convenios.css'
import '../atoms/navigation.css'
import '../atoms/search-with-filters.css'
import '../atoms/filter-panel.css'

interface Filters {
  q: string
  country: string
  language: string
  state: string
  agreement_type: string
  subscription_level: string
  validity: string
  subscription_year: string
  limit: number
  skip: number
}

const Convenios: React.FC = () => {
  const navigate = useNavigate()
  
  // Estados principales
  const [universidades, setUniversidades] = useState<UniversidadApi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUniversity, setSelectedUniversity] = useState<UniversidadApi | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingConvocatoria, setEditingConvocatoria] = useState<UniversidadApi | null>(null)

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({
    q: '',
    country: '',
    language: '',
    state: '',
    agreement_type: '',
    subscription_level: '',
    validity: '',
    subscription_year: '',
    limit: 0, // Sin límite por defecto
    skip: 0
  })

  // Opciones para filtros
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    languages: [] as string[],
    states: [] as string[],
    agreementTypes: [] as string[],
    subscriptionLevels: [] as string[],
    validityOptions: [] as string[],
    subscriptionYears: [] as string[]
  })

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await conveniosService.fetchConvenios(filters)
        setUniversidades(response.data)
        setTotalPages(response.totalPages)
        setTotalResults(response.total)
        setCurrentPage(response.page)
        
        // Cargar opciones de filtros
        const options = conveniosService.getFilterOptions()
        setFilterOptions(options)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Recargar datos cuando cambien los filtros (excluyendo paginación)
  useEffect(() => {
    const refreshData = async () => {
      setLoading(true)
      try {
        // Crear filtros sin skip para nueva búsqueda
        const searchFilters = {
          ...filters,
          skip: (currentPage - 1) * filters.limit
        }
        const response = await conveniosService.fetchConvenios(searchFilters)
        setUniversidades(response.data)
        setTotalPages(response.totalPages)
        setTotalResults(response.total)
      } catch (error) {
        console.error('Error refreshing data:', error)
      } finally {
        setLoading(false)
      }
    }

    refreshData()
  }, [filters.q, filters.country, filters.language, filters.state, filters.agreement_type, filters.subscription_level, filters.validity, filters.subscription_year, filters.limit, currentPage])

  // Calcular si hay filtros activos
  const hasActiveFilters = Object.values({
    country: filters.country,
    language: filters.language,
    state: filters.state,
    agreement_type: filters.agreement_type,
    subscription_level: filters.subscription_level,
    validity: filters.validity,
    subscription_year: filters.subscription_year
  }).some(value => value !== '')

  // Funciones de manejo
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      q: searchTerm
    }))
    setCurrentPage(1) // Reset a la primera página
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1) // Reset a la primera página
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setFilters(prev => ({
      ...prev,
      q: ''
    }))
    setCurrentPage(1) // Reset a la primera página
  }

  const handleClearAllFilters = () => {
    setSearchTerm('')
    setFilters({
      q: '',
      country: '',
      language: '',
      state: '',
      agreement_type: '',
      subscription_level: '',
      validity: '',
      subscription_year: '',
      limit: 0,
      skip: 0
    })
    setCurrentPage(1)
    setShowFilterPanel(false) // Cerrar el panel después de limpiar
  }

  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit: limit
    }))
    setCurrentPage(1) // Reset a la primera página
  }

  const handleUniversityClick = (universidad: UniversidadApi) => {
    setSelectedUniversity(universidad)
    setShowPopup(true)
  }

  const handleEdit = async (universidad: UniversidadApi) => {
    setEditingConvocatoria(universidad)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (id: string | number, updateData: Partial<UniversidadApi>) => {
    try {
      await conveniosService.updateConvenio(id, updateData)
      // Recargar datos manteniendo la página actual
      const searchFilters = {
        ...filters,
        skip: (currentPage - 1) * filters.limit
      }
      const response = await conveniosService.fetchConvenios(searchFilters)
      setUniversidades(response.data)
      setTotalPages(response.totalPages)
      setTotalResults(response.total)
      setShowEditModal(false)
      setEditingConvocatoria(null)
    } catch (error) {
      console.error('Error updating universidad:', error)
      throw error // Re-throw para que el modal pueda mostrar el error
    }
  }

  const handleDelete = async (universidad: UniversidadApi) => {
    try {
      const id = universidad.id || universidad._id || (universidad._id as any)?.$oid
      if (id) {
        await conveniosService.deleteConvenio(id)
        // Recargar datos manteniendo la página actual
        const searchFilters = {
          ...filters,
          skip: (currentPage - 1) * filters.limit
        }
        const response = await conveniosService.fetchConvenios(searchFilters)
        setUniversidades(response.data)
        setTotalPages(response.totalPages)
        setTotalResults(response.total)
      }
    } catch (error) {
      console.error('Error deleting universidad:', error)
      alert('Error al eliminar el convenio')
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setSelectedUniversity(null)
  }

  // Cerrar panel de filtros al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.filter-panel') && !target.closest('.filters-toggle-btn')) {
        setShowFilterPanel(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Manejar tecla Escape para cerrar el panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFilterPanel) {
        setShowFilterPanel(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showFilterPanel])

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Search and Filters */}
      <SearchWithFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        placeholder="Buscar universidades..."
        isSearching={loading}
        onClearSearch={handleClearSearch}
        hasActiveFilters={hasActiveFilters}
        onToggleFilters={() => setShowFilterPanel(!showFilterPanel)}
        activeFiltersCount={Object.values({
          country: filters.country,
          language: filters.language,
          state: filters.state,
          agreement_type: filters.agreement_type,
          subscription_level: filters.subscription_level,
          validity: filters.validity,
          subscription_year: filters.subscription_year
        }).filter(value => value !== '').length}
      />

      {/* Filter Panel */}
      <FilterPanel
        countries={filterOptions.countries}
        languages={filterOptions.languages}
        states={filterOptions.states}
        agreementTypes={filterOptions.agreementTypes}
        subscriptionLevels={filterOptions.subscriptionLevels}
        validityOptions={filterOptions.validityOptions}
        subscriptionYears={filterOptions.subscriptionYears}
        filters={{
          country: filters.country,
          language: filters.language,
          state: filters.state,
          agreement_type: filters.agreement_type,
          subscription_level: filters.subscription_level,
          validity: filters.validity,
          subscription_year: filters.subscription_year
        }}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearAllFilters}
        isVisible={showFilterPanel}
        onToggleVisibility={() => setShowFilterPanel(!showFilterPanel)}
      />

      {/* Content */}
      <div className="content-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-text">Cargando...</div>
          </div>
        ) : (
          <>
            {/* University Cards Grid usando CSS puro */}
            <div className="container">
              {universidades.map((universidad: UniversidadApi) => {
                const key = universidad.id || 
                           (typeof universidad._id === 'string' ? universidad._id : 
                            universidad._id?.$oid) || 
                           Math.random().toString()
                
                return (
                  <UniversityCard
                    key={key}
                    universidad={universidad as any}
                    onClick={handleUniversityClick}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )
              })}
            </div>

            {/* Empty state */}
            {universidades.length === 0 && (
              <div className="empty-state">
                <div className="empty-message">
                  No se encontraron convenios
                </div>
                <Button
                  onClick={handleClearAllFilters}
                  variant="primary"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Información de paginación */}
            {!loading && universidades.length > 0 && (
              <div className="pagination-info">
                <span>
                  {filters.limit > 0 ? (
                    <>
                      Mostrando {((currentPage - 1) * filters.limit) + 1} - {Math.min(currentPage * filters.limit, totalResults)} de {totalResults} resultados
                      <small style={{ marginLeft: '10px', color: '#888' }}>
                        (Página {currentPage} de {totalPages})
                      </small>
                    </>
                  ) : (
                    <>
                      Mostrando todos los {totalResults} resultados
                    </>
                  )}
                </span>
                <select 
                  value={filters.limit} 
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="items-per-page-select"
                >
                  <option value={0}>Todos</option>
                  <option value={3}>3 por página</option>
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>
            )}

            {/* Paginación */}
            {!loading && totalPages > 1 && filters.limit > 0 && (
              <div className="pagination-container">
                <div className="pagination-info-text">
                  Mostrando página {currentPage} de {totalPages} ({totalResults} resultados total)
                </div>
                <div className="pagination-wrapper">
                  <div className="pagination-navigation">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1 || loading}
                      className={`pagination-nav-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                      ‹‹ Primera
                    </button>
                    <div className="pagination-numbers">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        disabled={loading}
                      />
                    </div>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages || loading}
                      className={`pagination-nav-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                      Última ››
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de edición */}
      <EditConvocatoriaModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingConvocatoria(null)
        }}
        onSave={handleSaveEdit}
        convocatoria={editingConvocatoria}
      />

      {/* Popup */}
      <UniversityPopup
        universidad={selectedUniversity as any}
        isOpen={showPopup}
        onClose={closePopup}
      />
    </div>
  )
}

export default Convenios
