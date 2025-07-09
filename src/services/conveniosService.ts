interface ApiFilters {
  q?: string
  country?: string
  language?: string
  state?: string
  agreement_type?: string
  subscription_level?: string
  validity?: string
  subscription_year?: string
  institution?: string
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
  languages?: string | string[]
  subscriptionYear?: string
  subscriptionLevel?: string
  description?: string
  dreLink?: string
  agreementLink?: string
  internationalLink?: string
  availableSlots?: string
  duration?: string
}

import { HttpClient } from '../utils/httpClient'
import { API_CONFIG, APP_CONFIG } from '../config/api'
import { AuthService } from './authService'

// Specialized HTTP client for convocatorias (local backend)
class ConvocatoriasHttpClient {
  private static baseURL = API_CONFIG.CONVOCATORIAS_BASE_URL

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Agregar headers por defecto
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Agregar token de autenticación
    const token = AuthService.getToken()
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    // Combinar headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    }

    try {
      console.log(`Making request to: ${url}`)
      console.log('Headers:', headers)
      
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        // Obtener el mensaje de error del servidor si es posible
        let errorMessage = `HTTP error! status: ${response.status}`
        let errorData = null
        
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json()
            if (errorData.detail) {
              errorMessage = errorData.detail
            }
          } else {
            const textResponse = await response.text()
            errorMessage = textResponse || errorMessage
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError)
        }

        // Manejo específico de errores de autenticación
        if (response.status === 401) {
          console.error('🔐 Error de autenticación en convocatorias:', errorMessage)
          console.error('🔧 El servidor local necesita validar tokens de:', API_CONFIG.AUTH_BASE_URL || API_CONFIG.BASE_URL)
          console.error('💡 Configura tu servidor local para hacer requests a /api/v1/auth/me del servicio de Heroku')
          
          // Solo deslogear si es un error real de token expirado
          if (typeof errorMessage === 'string' && errorMessage.includes('Not authenticated')) {
            console.warn('⚠️ Deslogueando debido a token inválido...')
            AuthService.logout()
            window.location.href = APP_CONFIG.LOGIN_PATH
            throw new Error('Tu servidor local de convocatorias no puede validar el token de Heroku. Contacta al administrador.')
          }
        }

        if (response.status === 403) {
          console.error('🚫 Acceso denegado a convocatorias:', errorMessage)
          throw new Error('Acceso denegado. Tu token puede no tener permisos para convocatorias.')
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Response data:', data)
      return data
    } catch (error) {
      console.error('Request error:', error)
      
      // Si es un error de red, no redirigir automáticamente
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servicio de convocatorias. Verifique que esté funcionando en http://127.0.0.1:8000')
      }
      throw error
    }
  }
}

class ConveniosService {
  // Método de diagnóstico para verificar la conectividad
  async checkConvocatoriasService(): Promise<{ status: string, url: string, message: string }> {
    const url = `${API_CONFIG.CONVOCATORIAS_BASE_URL}/convocatorias/?limit=1`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      return {
        status: response.ok ? 'success' : 'error',
        url,
        message: response.ok 
          ? 'Servicio de convocatorias disponible' 
          : `Error ${response.status}: ${response.statusText}`
      }
    } catch (error) {
      return {
        status: 'error',
        url,
        message: `No se pudo conectar al servicio: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }
    }
  }

  async fetchConvenios(filters: ApiFilters = {}): Promise<ConveniosResponse> {
    try {
      // Primero verificar si el servicio está disponible
      const serviceCheck = await this.checkConvocatoriasService()
      if (serviceCheck.status === 'error') {
        console.warn('Convocatorias service check failed:', serviceCheck.message)
        // No deslogear, solo mostrar error específico
        throw new Error(`Servicio no disponible: ${serviceCheck.message}`)
      }

      const params = new URLSearchParams()
      
      // Extraer valores para cálculos internos (sin forzar valores por defecto en la request)
      const limit = filters.limit || 10
      const skip = filters.skip || 0
      
      // Solo enviar parámetros que tengan valores, sin forzar valores por defecto
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 0) {
          params.append(key, value.toString())
        }
      })

      console.log('Fetching convocatorias from:', `${API_CONFIG.CONVOCATORIAS_BASE_URL}${API_CONFIG.ENDPOINTS.CONVOCATORIAS.LIST}?${params.toString()}`)
      
      const data = await ConvocatoriasHttpClient.request<any>(`${API_CONFIG.ENDPOINTS.CONVOCATORIAS.LIST}?${params.toString()}`, {
        method: 'GET'
      })
      
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
      console.error('Error fetching convenios:', error)
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
        languages: Array.isArray(item.languages) ? item.languages : 
                   (item.languages || item.idiomas ? 
                    (item.languages || item.idiomas).split(',').map((lang: string) => lang.trim()).filter(Boolean) : 
                    []),
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
      const response = await ConvocatoriasHttpClient.request<UniversidadApi>(API_CONFIG.ENDPOINTS.CONVOCATORIAS.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      })

      return response
    } catch (error) {
      console.error('Error updating convenio:', error)
      throw error
    }
  }

  async deleteConvenio(id: string | number): Promise<void> {
    try {
      await ConvocatoriasHttpClient.request<void>(API_CONFIG.ENDPOINTS.CONVOCATORIAS.DELETE(id), {
        method: 'DELETE'
      })
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
        "Marco+Intercambio",
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
        "Universidad Nacional de Colombia",
        "Institucional"
      ],
      validityOptions: [
        "Indefinido",
        "5 años",
        "10 años",
        "3 años",
        "Por definir"
      ],
      subscriptionYears: [
        "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", 
        "2016", "2015", "2014", "2013", "2012", "2011", "2010"
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

  // Método de diagnóstico completo
  async runDiagnostics(): Promise<void> {
    console.log('🔍 Ejecutando diagnósticos...')
    
    // 1. Verificar token
    const token = AuthService.getToken()
    console.log('🔐 Token presente:', !!token)
    if (token) {
      console.log('🔐 Token (primeros 20 chars):', token.substring(0, 20) + '...')
    }
    
    // 2. Verificar configuración
    console.log('⚙️ Auth URL:', API_CONFIG.AUTH_BASE_URL || API_CONFIG.BASE_URL)
    console.log('⚙️ Convocatorias URL:', API_CONFIG.CONVOCATORIAS_BASE_URL)
    
    // 3. Verificar servicio de convocatorias
    console.log('🌐 Verificando servicio de convocatorias...')
    const serviceCheck = await this.checkConvocatoriasService()
    console.log('🌐 Estado del servicio:', serviceCheck)
    
    // 4. Intentar una petición simple
    if (serviceCheck.status === 'success') {
      console.log('📋 Intentando obtener convocatorias...')
      try {
        const result = await this.fetchConvenios({ limit: 1 })
        console.log('✅ Convocatorias obtenidas exitosamente:', result.total, 'total')
      } catch (error) {
        console.log('❌ Error obteniendo convocatorias:', error)
      }
    }
  }
}

export default new ConveniosService()
