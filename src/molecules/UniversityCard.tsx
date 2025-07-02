import React from 'react'
import Badge from '../atoms/Badge'
import Button from '../atoms/Button'

export interface Universidad {
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

interface UniversityCardProps {
  universidad: Universidad
  onClick: (universidad: Universidad) => void
  onEdit?: (universidad: Universidad) => void
  onDelete?: (universidad: Universidad) => void
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  universidad,
  onClick,
  onEdit,
  onDelete
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(universidad)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('¿Seguro que deseas eliminar este convenio?')) {
      onDelete?.(universidad)
    }
  }

  const getStatusClass = (status: string): string => {
    if (status.toLowerCase() === 'vigente') return 'qualified'
    if (status.toLowerCase() === 'no vigente') return 'unqualified'
    if (status.toLowerCase() === 'pendiente') return 'negotiation'
    return 'new'
  }

  const getValidityClass = (validity: string | undefined): string => {
    if (!validity) return ''
    
    // Verificar si la fecha es futura
    const validityMatch = validity.match(/([A-Za-záéíóúñ]+)\s*-\s*(\d{4})/)
    if (validityMatch) {
      const months: { [key: string]: number } = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
      }
      
      const monthStr = validityMatch[1].toLowerCase()
      const year = parseInt(validityMatch[2], 10)
      const month = months[monthStr]
      
      if (month !== undefined) {
        const now = new Date()
        const validityDate = new Date(year, month + 1, 0)
        const isFuture = validityDate >= new Date(now.getFullYear(), now.getMonth(), 1)
        return isFuture ? 'vigente' : ''
      }
    }
    return ''
  }

  const isNoVigente = universidad.state.toLowerCase() === 'no vigente'

  return (
    <div className="card" onClick={() => onClick(universidad)}>
      {/* Header */}
      <div className={`card-header ${isNoVigente ? 'no-vigente' : ''}`}>
        <h2 className="card-title">
          <img 
            src={`/src/assets/flags/${universidad.country}.png`} 
            alt={`${universidad.country} flag`} 
            className="flag"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/flags/Internacional.png'
            }}
          />
          {universidad.institution}
        </h2>
        {universidad.subscriptionLevel && (
          <div className="card-subtitle">{universidad.subscriptionLevel}</div>
        )}
      </div>

      {/* Content */}
      <div className="card-content">
        {/* Status y Validity */}
        <div style={{ marginBottom: '12px' }}>
          <span className={`card-status ${getStatusClass(universidad.state)}`}>
            {universidad.state.toUpperCase()}
          </span>
          {universidad.validity && (
            <span className={`card-validity ${getValidityClass(universidad.validity)}`}>
              {getValidityClass(universidad.validity) ? 
                <><i className="fas fa-calendar-check"></i> {universidad.validity}</> :
                <><i className="fas fa-calendar-times" style={{color: '#ef4444'}}></i> {universidad.validity}</>
              }
            </span>
          )}
        </div>

        {/* Description Grid */}
        <div className="card-description">
          <div>
            <strong>PAÍS</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img 
                src={`/src/assets/flags/${universidad.country}.png`} 
                alt={`${universidad.country} flag`} 
                className="flag"
                style={{ width: '20px', height: '15px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/flags/Internacional.png'
                }}
              />
              {universidad.country}
            </div>
          </div>
          
          <div>
            <strong>TIPO DE ACUERDO</strong>
            <div>{universidad.agreementType}</div>
          </div>
          
          <div>
            <strong>IDIOMAS</strong>
            <div>{universidad.languages || '-'}</div>
          </div>
          
          <div>
            <strong>AÑO SUSCRIPCIÓN</strong>
            <div>{universidad.subscriptionYear || '-'}</div>
          </div>
        </div>

        {/* Links */}
        {(universidad.dreLink || universidad.agreementLink || universidad.internationalLink) && (
          <div className="card-links">
            {universidad.dreLink && (
              <a href={universidad.dreLink} target="_blank" rel="noopener noreferrer">
                DRE Link
              </a>
            )}
            {universidad.agreementLink && (
              <a href={universidad.agreementLink} target="_blank" rel="noopener noreferrer">
                Agreement Link
              </a>
            )}
            {universidad.internationalLink && (
              <a href={universidad.internationalLink} target="_blank" rel="noopener noreferrer">
                International Link
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="card-actions">
            {onEdit && (
              <button onClick={() => handleEdit({} as React.MouseEvent)}>
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={() => handleDelete({} as React.MouseEvent)}>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityCard
