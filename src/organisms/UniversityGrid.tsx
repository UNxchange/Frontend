import React from 'react'
import UniversityCard from '../molecules/UniversityCard'
import { UniversidadApi } from '../services/conveniosService'

interface UniversityGridProps {
  universities: UniversidadApi[]
  loading: boolean
  onCardClick: (university: UniversidadApi) => void
}

const UniversityGrid: React.FC<UniversityGridProps> = ({
  universities,
  loading,
  onCardClick
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          <i className="fas fa-search text-4xl mb-4 block"></i>
          No se encontraron universidades con los filtros aplicados
        </div>
      </div>
    )
  }

  const getUniversityKey = (university: UniversidadApi): string => {
    if (university.id) {
      return typeof university.id === 'string' ? university.id : university.id.toString()
    }
    if (university._id) {
      return typeof university._id === 'string' ? university._id : university._id.$oid
    }
    return university.institution + university.country // fallback
  }

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {universities.map((university) => (
        <UniversityCard
          key={getUniversityKey(university)}
          universidad={university}
          onClick={() => onCardClick(university)}
        />
      ))}
    </div>
  )
}

export default UniversityGrid
