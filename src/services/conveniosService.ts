interface ApiFilters {
  q?: string
  country?: string
  language?: string
  state?: string
  agreement_type?: string
  subscription_level?: string
  limit?: number
  skip?: number
}

export interface ConveniosResponse {
  data: UniversidadApi[]
  total: number
  page: number
  totalPages: number
}

export interface UniversidadApi {
  id?: number | string
  _id?: string | { $oid: string }
  // Campos en español (del API)
  universidad?: string
  paisUniversidad?: string
  ciudad?: string
  estado?: string
  vigencia?: string
  duracion?: string
  fechaFirma?: string
  tipoAcuerdo?: string
  idiomas?: string
  añoSuscripcion?: string
  nivelSuscripcion?: string
  descripcion?: string
  enlaceDre?: string
  enlaceAcuerdo?: string
  enlaceInternacional?: string
  cuposDisponibles?: string
  properties?: any
  // Campos en inglés (formato esperado)
  institution: string
  country: string
  city?: string
  agreementType: string
  validity?: string
  state: 'vigente' | 'no-vigente' | 'pendiente'
  languages?: string
  subscriptionYear?: string
  subscriptionLevel?: string
  description?: string
  dreLink?: string
  agreementLink?: string
  internationalLink?: string
  availableSlots?: string
  duration?: string
}

const API_BASE_URL = 'http://127.0.0.1:8000'

class ConveniosService {
  async fetchConvenios(filters: ApiFilters = {}): Promise<ConveniosResponse> {
    try {
      const params = new URLSearchParams()
      
      // Asegurar valores por defecto para paginación
      const limit = filters.limit || 10
      const skip = filters.skip || 0
      
      // Solo enviar parámetros que tengan valores
      Object.entries({ ...filters, limit, skip }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })


      
      const response = await fetch(`${API_BASE_URL}/convocatorias/?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`)
      }
      

      const data = await response.json()
      
      // CASO 1: La API ya devuelve datos paginados (formato esperado: {data, total, page, totalPages})
      if (data.data && typeof data.total === 'number') {
        const mappedData = this.mapApiDataToFrontendFormat(data.data)
        return {
          data: mappedData,
          total: data.total,
          page: data.page || Math.floor(skip / limit) + 1,
          totalPages: data.totalPages || Math.ceil(data.total / limit)
        }
      }
      
      // CASO 2: La API devuelve un array (aplicar paginación en frontend)
      if (Array.isArray(data)) {
        const mappedData = this.mapApiDataToFrontendFormat(data)
        
        // Aplicar paginación en frontend ya que el servidor no la maneja
        const total = mappedData.length
        const totalPages = Math.ceil(total / limit)
        const page = Math.floor(skip / limit) + 1
        
        const startIndex = skip
        const endIndex = skip + limit
        const paginatedData = mappedData.slice(startIndex, endIndex)
        
        return {
          data: paginatedData,
          total,
          page,
          totalPages
        }
      }
      
      // CASO 3: Formato desconocido
      throw new Error('Formato de respuesta de la API no reconocido')
      
    } catch (error) {
      throw error
    }
  }

  /**
   * Mapea los datos de la API al formato esperado por el frontend
   */
  private mapApiDataToFrontendFormat(data: any[]): UniversidadApi[] {
    return data.map(item => {
      // Extraer el ID del objeto MongoDB
      let id = item.id || item._id
      if (typeof id === 'object' && id?.$oid) {
        id = id.$oid
      }
      
      // Mapear el estado correctamente
      let state: 'vigente' | 'no-vigente' | 'pendiente' = 'vigente'
      if (item.estado) {
        const estadoLower = item.estado.toLowerCase()
        if (estadoLower.includes('vigente')) {
          state = 'vigente'
        } else if (estadoLower.includes('no vigente') || estadoLower.includes('no-vigente')) {
          state = 'no-vigente'
        } else if (estadoLower.includes('pendiente')) {
          state = 'pendiente'
        }
      }
      
      // Extraer información de properties si existe
      const properties = item.properties || {}
      const agreementType = properties['Tipo de acuerdo'] || item.agreementType || item.tipoAcuerdo || 'Acuerdo general'
      const city = properties['Ciudad'] || item.city || item.ciudad || ''
      
      return {
        id,
        institution: item.universidad || item.institution || 'Sin nombre',
        country: item.paisUniversidad || item.country || item.pais || 'Sin país',
        city,
        agreementType,
        validity: item.vigencia || item.validity || '',
        state,
        languages: Array.isArray(item.languages) ? item.languages.join(', ') : (item.languages || item.idiomas || ''),
        subscriptionYear: item.subscriptionYear || item.añoSuscripcion || '',
        subscriptionLevel: item.subscriptionLevel || item.nivelSuscripcion || '',
        description: typeof properties === 'object' ? JSON.stringify(properties) : (item.description || item.descripcion || ''),
        dreLink: item.dreLink || item.enlaceDre || '',
        agreementLink: item.agreementLink || item.enlaceAcuerdo || '',
        internationalLink: item.internationalLink || item.enlaceInternacional || '',
        duration: item.duracion || item.duration || '',
        availableSlots: item.availableSlots || item.cuposDisponibles || ''
      }
    })
  }

  async updateConvenio(id: string | number, updateData: Partial<UniversidadApi>): Promise<UniversidadApi> {
    try {
      const response = await fetch(`${API_BASE_URL}/convocatorias/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating convenio:', error)
      throw error
    }
  }

  async deleteConvenio(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/convocatorias/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting convenio:', error)
      throw error
    }
  }


  getFilterOptions() {
    return {
      countries: [
        "Argentina", "Australia", "Austria", "Bélgica", "Brasil", "Bulgaria", 
        "Canadá", "Chile", "China", "Colombia", "Corea del Sur", "Costa Rica", 
        "Dinamarca", "Ecuador", "España", "Estados Unidos", "Finlandia", 
        "Francia", "Alemania", "Grecia", "México", "Países Bajos", "Portugal", 
        "Reino Unido", "Suecia", "Suiza"
      ],
      languages: ["Español", "Inglés", "Francés", "Portugués", "Alemán", "Italiano", "Mandarín", "Japonés", "Coreano"],
      states: ["vigente", "no-vigente", "pendiente"],
      agreementTypes: [
        "Intercambio Estudiantil", 
        "Investigación", 
        "Intercambio Académico", 
        "Doble Titulación", 
        "Marco", 
        "Específico",
        "Cooperación Académica",
        "Intercambio Docente",
        "Prácticas Profesionales"
      ],
      subscriptionLevels: [
        "Facultad de Ciencias Humanas", 
        "Facultad de Ingeniería", 
        "Facultad de Ciencias", 
        "Facultad de Medicina",
        "Facultad de Artes",
        "Facultad de Derecho",
        "Facultad de Economía",
        "Facultad de Educación",
        "Facultad de Ciencias Sociales",
        "Institucional"
      ]
    }
  }

  // Método para obtener estadísticas de paginación
  getPaginationInfo(currentPage: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit)
    const startItem = ((currentPage - 1) * limit) + 1
    const endItem = Math.min(currentPage * limit, total)
    
    return {
      currentPage,
      totalPages,
      total,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      limit
    }
  }

  // Método para construir URLs de paginación
  buildPaginationUrl(baseFilters: ApiFilters, page: number, limit: number = 20): ApiFilters {
    return {
      ...baseFilters,
      limit,
      skip: (page - 1) * limit
    }
  }
}

export default new ConveniosService()
