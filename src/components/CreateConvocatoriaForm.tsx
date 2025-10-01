import React, { useState } from 'react'
import { ConvocatoriaCreate } from '../types'
import { ConvocatoriasService } from '../services/convocatoriasService'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import './create-convocatoria-form.css'

interface CreateConvocatoriaFormProps {
  onSuccess?: (convocatoria: any) => void
  onCancel?: () => void
}

const CreateConvocatoriaForm: React.FC<CreateConvocatoriaFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  
  const [formData, setFormData] = useState<ConvocatoriaCreate>({
    subscriptionYear: '',
    country: '',
    institution: '',
    agreementType: '',
    validity: '',
    state: 'Vigente',
    subscriptionLevel: '',
    languages: [],
    dreLink: '',
    agreementLink: '',
    Props: '',
    internationalLink: ''
  })

  // Opciones para los selects
  const stateOptions = [
    { value: 'Vigente', label: 'Vigente' },
    { value: 'No Vigente', label: 'No Vigente' }
  ]

  const agreementTypeOptions = [
    { value: 'Intercambio', label: 'Intercambio' },
    { value: 'Cooperación', label: 'Cooperación' },
    { value: 'Movilidad', label: 'Movilidad' },
    { value: 'Investigación', label: 'Investigación' }
  ]

  const languageOptions = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 
    'Chino', 'Japonés', 'Coreano', 'Ruso', 'Árabe'
  ]

  const handleInputChange = (name: keyof ConvocatoriaCreate, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, language]
        : prev.languages.filter(lang => lang !== language)
    }))
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      'subscriptionYear', 'country', 'institution', 'agreementType',
      'validity', 'subscriptionLevel'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field as keyof ConvocatoriaCreate]) {
        setError(`El campo ${field} es requerido`)
        return false
      }
    }

    if (formData.languages.length === 0) {
      setError('Debe seleccionar al menos un idioma')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await ConvocatoriasService.createConvocatoria(formData)
      setSuccess('¡Convocatoria creada exitosamente!')
      
      // Reset form
      setFormData({
        subscriptionYear: '',
        country: '',
        institution: '',
        agreementType: '',
        validity: '',
        state: 'Vigente',
        subscriptionLevel: '',
        languages: [],
        dreLink: '',
        agreementLink: '',
        Props: '',
        internationalLink: ''
      })

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la convocatoria')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-convocatoria-form">
      <h2 className="form-title">Crear Nueva Convocatoria</h2>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="convocatoria-form">
        <div className="form-grid">
          {/* Año de suscripción */}
          <div className="form-group">
            <label htmlFor="subscriptionYear">Año de Suscripción *</label>
            <Input
              id="subscriptionYear"
              type="text"
              placeholder="2024"
              value={formData.subscriptionYear}
              onChange={(e) => handleInputChange('subscriptionYear', e.target.value)}
              required
            />
          </div>

          {/* País */}
          <div className="form-group">
            <label htmlFor="country">País *</label>
            <Input
              id="country"
              type="text"
              placeholder="Alemania"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              required
            />
          </div>

          {/* Institución */}
          <div className="form-group full-width">
            <label htmlFor="institution">Institución *</label>
            <Input
              id="institution"
              type="text"
              placeholder="Universidad Nacional de Colombia"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              required
            />
          </div>

          {/* Tipo de Acuerdo */}
          <div className="form-group">
            <label htmlFor="agreementType">Tipo de Acuerdo *</label>
            <Select
              id="agreementType"
              value={formData.agreementType}
              onChange={(value) => handleInputChange('agreementType', value)}
              options={agreementTypeOptions}
              placeholder="Seleccionar tipo"
            />
          </div>

          {/* Estado */}
          <div className="form-group">
            <label htmlFor="state">Estado *</label>
            <Select
              id="state"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
              options={stateOptions}
            />
          </div>

          {/* Vigencia */}
          <div className="form-group">
            <label htmlFor="validity">Vigencia *</label>
            <Input
              id="validity"
              type="text"
              placeholder="March - 2024"
              value={formData.validity}
              onChange={(e) => handleInputChange('validity', e.target.value)}
              required
            />
          </div>

          {/* Nivel de suscripción */}
          <div className="form-group">
            <label htmlFor="subscriptionLevel">Nivel de Suscripción *</label>
            <Input
              id="subscriptionLevel"
              type="text"
              placeholder="Universidad Nacional de Colombia"
              value={formData.subscriptionLevel}
              onChange={(e) => handleInputChange('subscriptionLevel', e.target.value)}
              required
            />
          </div>

          {/* Idiomas */}
          <div className="form-group full-width">
            <label>Idiomas *</label>
            <div className="languages-grid">
              {languageOptions.map((language) => (
                <label key={language} className="language-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(language)}
                    onChange={(e) => handleLanguageChange(language, e.target.checked)}
                  />
                  <span>{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Enlaces */}
          <div className="form-group full-width">
            <label htmlFor="dreLink">Enlace DRE</label>
            <Input
              id="dreLink"
              type="url"
              placeholder="https://..."
              value={formData.dreLink || ''}
              onChange={(e) => handleInputChange('dreLink', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="agreementLink">Enlace del Acuerdo</label>
            <Input
              id="agreementLink"
              type="url"
              placeholder="https://..."
              value={formData.agreementLink || ''}
              onChange={(e) => handleInputChange('agreementLink', e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="internationalLink">Enlace Internacional</label>
            <Input
              id="internationalLink"
              type="url"
              placeholder="https://..."
              value={formData.internationalLink || ''}
              onChange={(e) => handleInputChange('internationalLink', e.target.value)}
            />
          </div>

          {/* Propiedades */}
          <div className="form-group full-width">
            <label htmlFor="Props">Propiedades</label>
            <textarea
              id="Props"
              placeholder="Describe las características y propiedades de esta convocatoria..."
              value={formData.Props || ''}
              onChange={(e) => handleInputChange('Props', e.target.value)}
              rows={4}
              className="props-textarea"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creando...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Crear Convocatoria
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateConvocatoriaForm
