import React, { useState, useEffect } from 'react'
import { UniversidadApi } from '../services/conveniosService'

interface EditConvocatoriaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string | number, data: Partial<UniversidadApi>) => Promise<void>
  convocatoria: UniversidadApi | null
}

const EditConvocatoriaModal: React.FC<EditConvocatoriaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  convocatoria
}) => {
  const [formData, setFormData] = useState<Partial<UniversidadApi>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (convocatoria) {
      setFormData({
        institution: convocatoria.institution || '',
        country: convocatoria.country || '',
        city: convocatoria.city || '',
        agreementType: convocatoria.agreementType || '',
        validity: convocatoria.validity || '',
        state: convocatoria.state || 'vigente',
        languages: Array.isArray(convocatoria.languages) 
          ? convocatoria.languages.join(', ') 
          : (convocatoria.languages || ''),
        subscriptionYear: convocatoria.subscriptionYear || '',
        subscriptionLevel: convocatoria.subscriptionLevel || '',
        description: convocatoria.description || '',
        dreLink: convocatoria.dreLink || '',
        agreementLink: convocatoria.agreementLink || '',
        internationalLink: convocatoria.internationalLink || '',
        duration: convocatoria.duration || '',
        availableSlots: convocatoria.availableSlots || ''
      })
    }
  }, [convocatoria])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!convocatoria) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const id = convocatoria.id || (convocatoria._id as any)?.$oid || convocatoria._id
      if (id) {
        // Preparar datos para enviar, convirtiendo languages a array si es necesario
        const dataToSend = {
          ...formData,
          languages: formData.languages ? 
            (typeof formData.languages === 'string' ? 
              formData.languages.split(',').map(lang => lang.trim()).filter(Boolean) : 
              formData.languages) : 
            []
        }
        await onSave(id, dataToSend)
        onClose()
      }
    } catch (error) {
      console.error('Error updating convocatoria:', error)
      setError('Error al actualizar la convocatoria. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !convocatoria) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '800px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
              Editar Convocatoria
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Actualizar información de la convocatoria
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              padding: '10px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#dc2626'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Institución *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                País *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Tipo de Acuerdo
              </label>
              <input
                type="text"
                name="agreementType"
                value={formData.agreementType || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Estado
              </label>
              <select
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="vigente">Vigente</option>
                <option value="no-vigente">No Vigente</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Validez
              </label>
              <input
                type="text"
                name="validity"
                value={formData.validity || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Idiomas
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages || ''}
                onChange={handleInputChange}
                placeholder="Ej: Español, Inglés, Francés"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Separar múltiples idiomas con comas
              </small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Año de Suscripción
              </label>
              <input
                type="text"
                name="subscriptionYear"
                value={formData.subscriptionYear || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Nivel de Suscripción
            </label>
            <input
              type="text"
              name="subscriptionLevel"
              value={formData.subscriptionLevel || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Duración
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Plazas Disponibles
              </label>
              <input
                type="text"
                name="availableSlots"
                value={formData.availableSlots || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Enlace DRE
            </label>
            <input
              type="url"
              name="dreLink"
              value={formData.dreLink || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Enlace del Acuerdo
            </label>
            <input
              type="url"
              name="agreementLink"
              value={formData.agreementLink || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Enlace Internacional
            </label>
            <input
              type="url"
              name="internationalLink"
              value={formData.internationalLink || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid #e9ecef',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#1a56db',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditConvocatoriaModal
