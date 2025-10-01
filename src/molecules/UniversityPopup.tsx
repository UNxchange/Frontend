import React from 'react'
import Badge from '../atoms/Badge'
import './UniversityPopup.css'

interface Universidad {
  id: number | string
  institution: string
  country: string
  city?: string
  agreementType: string
  validity?: string
  state: string
  languages?: string | string[]
  subscriptionYear?: string
  subscriptionLevel?: string
  properties?: string
  dreLink?: string
  agreementLink?: string
  internationalLink?: string
  availableSlots?: string
  duration?: string
}

interface UniversityPopupProps {
  universidad: Universidad | null
  isOpen: boolean
  onClose: () => void
}

const UniversityPopup: React.FC<UniversityPopupProps> = ({
  universidad,
  isOpen,
  onClose
}) => {
  if (!isOpen || !universidad) return null

  // Debug: verificar datos recibidos
  console.log('Universidad data:', universidad)
  console.log('Properties field:', universidad.properties)

  // Helper function to format languages
  const formatLanguages = (languages: string | string[] | undefined): string => {
    if (!languages) return 'No especificado'
    if (Array.isArray(languages)) {
      return languages.join(', ')
    }
    return languages
  }

  // Helper function to check if validity date is expired
  const isValidityExpired = (validity: string | undefined): boolean => {
    if (!validity) return false
    
    const currentDate = new Date()
    const validityDate = new Date(validity)
    
    // Si la fecha no es válida, no está expirada
    if (isNaN(validityDate.getTime())) return false
    
    return validityDate < currentDate
  }

  const getStatusVariant = (status: string): 'vigente' | 'no-vigente' | 'pendiente' => {
    if (status.toLowerCase() === 'vigente') return 'vigente'
    if (status.toLowerCase() === 'no vigente') return 'no-vigente'
    return 'pendiente'
  }

  const isNoVigente = universidad.state.toLowerCase() === 'no vigente' || universidad.state.toLowerCase() === 'no-vigente'

  return (
    <>
      {/* Overlay */}
      <div
        className="university-popup-overlay"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="university-popup-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with university name and flag */}
          <div className={`university-popup-header ${universidad.state}`}>
            <button
              onClick={onClose}
              className="university-popup-close"
            >
              ×
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="university-popup-title">
                  {universidad.institution}
                </h2>
                <p className="university-popup-subtitle">
                  Escuela de Ingeniería - Convocatoria 2023
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <img 
                  src={`/assets/flags/${universidad.country}.png`} 
                  alt={`${universidad.country} flag`} 
                  className="university-popup-flag"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/flags/Internacional.png'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="university-popup-content">
            {/* Information Section */}
            <div className="university-popup-section">
              <h3 className="university-popup-section-title">
                Información de la Convocatoria
              </h3>
              
              <div className="university-popup-info-grid">
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    UNIVERSIDAD
                  </div>
                  <div className="university-popup-info-value">
                    {universidad.institution}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    PAÍS
                  </div>
                  <div className="university-popup-info-value">
                    {universidad.country}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    TIPO DE ACUERDO
                  </div>
                  <div className="university-popup-info-value">
                    {universidad.agreementType || 'No especificado'}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    LENGUAJE
                  </div>
                  <div className="university-popup-info-value">
                    {formatLanguages(universidad.languages)}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    ESTADO
                  </div>
                  <div className="university-popup-info-value">
                    <Badge variant={getStatusVariant(universidad.state)}>
                      {universidad.state.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    VALIDEZ
                  </div>
                  <div className="university-popup-info-value">
                    <span className={`university-popup-validity-icon ${isValidityExpired(universidad.validity) ? 'expired' : 'valid'}`}>
                      {isValidityExpired(universidad.validity) ? '✗' : '✓'}
                    </span>
                    {universidad.validity || 'No especificado'}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    AÑO SUSCRIPCIÓN
                  </div>
                  <div className="university-popup-info-value">
                    {universidad.subscriptionYear || 'No especificado'}
                  </div>
                </div>
                
                <div className="university-popup-info-item">
                  <div className="university-popup-info-label">
                    NIVEL SUSCRIPCIÓN
                  </div>
                  <div className="university-popup-info-value">
                    {universidad.subscriptionLevel || 'No especificado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="university-popup-section">
              <h3 className="university-popup-section-title">Descripción</h3>
              <div className="university-popup-description">
                {universidad.properties ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {universidad.properties.split('\n').map((item: string, index: number) => (
                      <li key={index} className="text-gray-700">
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0 text-gray-500">
                    No hay descripción disponible para este convenio.
                  </p>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="university-popup-section">
              <h3 className="university-popup-section-title">Links de Interés</h3>
              <div className="university-popup-links-grid">
                {universidad.agreementLink && (
                  <a 
                    href={universidad.agreementLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="university-popup-link-card blue"
                  >
                    <div className="university-popup-link-icon">📄</div>
                    <div className="university-popup-link-title">
                      Convocatoria Oficial
                    </div>
                    <div className="university-popup-link-description">
                      Documento PDF con todos los detalles
                    </div>
                  </a>
                )}
                
                {universidad.internationalLink && (
                  <a 
                    href={universidad.internationalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="university-popup-link-card orange"
                  >
                    <div className="university-popup-link-icon">🌐</div>
                    <div className="university-popup-link-title">
                      Sitio Web Universidad
                    </div>
                    <div className="university-popup-link-description">
                      Página oficial de la institución
                    </div>
                  </a>
                )}
                
                {universidad.dreLink && (
                  <a 
                    href={universidad.dreLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="university-popup-link-card red"
                  >
                    <div className="university-popup-link-icon">📝</div>
                    <div className="university-popup-link-title">
                      Documento DRE
                    </div>
                    <div className="university-popup-link-description">
                      Información académica oficial
                    </div>
                  </a>
                )}
                
                {(!universidad.agreementLink && !universidad.internationalLink && !universidad.dreLink) && (
                  <div className="university-popup-no-links">
                    <p>No hay enlaces disponibles para este convenio.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UniversityPopup
