import React from 'react'
import Badge from '../atoms/Badge'

interface Universidad {
  id: number | string
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

  const getStatusVariant = (status: string): 'vigente' | 'no-vigente' | 'pendiente' => {
    if (status.toLowerCase() === 'vigente') return 'vigente'
    if (status.toLowerCase() === 'no vigente') return 'no-vigente'
    return 'pendiente'
  }

  const isNoVigente = universidad.state.toLowerCase() === 'no vigente'

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-51 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          &times;
        </button>

        {/* Header */}
        <div className={`p-6 ${isNoVigente ? 'bg-red-50' : 'bg-blue-50'} rounded-t-lg`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {universidad.institution}
              </h2>
              <p className="text-gray-600">Escuela de Ingeniería - Convocatoria 2023</p>
            </div>
            <img 
              src={`/src/assets/flags/${universidad.country}.png`} 
              alt={`${universidad.country} flag`} 
              className="w-12 h-8 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/flags/Internacional.png'
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusVariant(universidad.state)}>
              {universidad.state.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Información de la Convocatoria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Universidad</div>
              <div className="mt-1 text-gray-900">{universidad.institution}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">País</div>
              <div className="mt-1 text-gray-900 flex items-center gap-2">
                <img 
                  src={`/src/assets/flags/${universidad.country}.png`} 
                  alt={`${universidad.country} flag`} 
                  className="w-6 h-4 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/flags/Internacional.png'
                  }}
                />
                {universidad.country}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tipo de Acuerdo</div>
              <div className="mt-1 text-gray-900">{universidad.agreementType || '-'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lenguaje</div>
              <div className="mt-1 text-gray-900">{universidad.languages || '-'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</div>
              <div className="mt-1">
                <Badge variant={getStatusVariant(universidad.state)}>
                  {universidad.state.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Validez</div>
              <div className="mt-1 text-gray-900 flex items-center gap-1">
                <i className="fas fa-calendar-check text-green-500"></i>
                {universidad.validity || '-'}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Año Suscripción</div>
              <div className="mt-1 text-gray-900">{universidad.subscriptionYear || '-'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Plazas Disponibles</div>
              <div className="mt-1 text-gray-900">{universidad.availableSlots || '-'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duración</div>
              <div className="mt-1 text-gray-900">{universidad.duration || '-'}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Descripción</h3>
            <p className="text-gray-700">
              {universidad.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Links de Interés</h3>
            <div className="flex flex-wrap gap-3">
              {universidad.dreLink && (
                <a
                  href={universidad.dreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-file-alt"></i>
                  DRE Link
                </a>
              )}
              {universidad.agreementLink && (
                <a
                  href={universidad.agreementLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  <i className="fas fa-file-contract"></i>
                  Agreement Link
                </a>
              )}
              {universidad.internationalLink && (
                <a
                  href={universidad.internationalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  <i className="fas fa-globe"></i>
                  International Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UniversityPopup
