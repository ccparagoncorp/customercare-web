"use client"

import { useEffect, useState } from "react"

interface TracerUpdate {
  id: string
  sourceTable: string
  sourceKey: string
  fieldName: string
  oldValue: string | null
  newValue: string | null
  actionType: string
  changedAt: string
  changedBy: string | null
  updateNotes?: string | null // Optional, might come from source table
}

interface TracerUpdateDisplayProps {
  // Scope-based parameters (preferred)
  brandId?: string
  categoryId?: string
  subcategoryId?: string
  knowledgeId?: string
  sopId?: string
  qualityTrainingId?: string
  // Legacy parameters (for backward compatibility)
  sourceTable?: string
  sourceKey?: string
  title?: string
}

export function TracerUpdateDisplay({ 
  brandId,
  categoryId,
  subcategoryId,
  knowledgeId,
  sopId,
  qualityTrainingId,
  sourceTable,
  sourceKey,
  title 
}: TracerUpdateDisplayProps) {
  const [tracerUpdates, setTracerUpdates] = useState<TracerUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracerUpdates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build URL with scope-based parameters
        const params = new URLSearchParams()
        if (brandId) params.append('brandId', brandId)
        else if (categoryId) params.append('categoryId', categoryId)
        else if (subcategoryId) params.append('subcategoryId', subcategoryId)
        else if (knowledgeId) params.append('knowledgeId', knowledgeId)
        else if (sopId) params.append('sopId', sopId)
        else if (qualityTrainingId) params.append('qualityTrainingId', qualityTrainingId)
        else if (sourceTable) {
          params.append('sourceTable', sourceTable)
          if (sourceKey) params.append('sourceKey', sourceKey)
        }

        const url = `/api/tracer-updates?${params.toString()}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setTracerUpdates(data)
        } else if (response.status === 503) {
          // Service unavailable - database connection issue
          // Return empty array to show "no updates" message instead of error
          setTracerUpdates([])
        } else {
          setError('Failed to fetch tracer updates')
        }
      } catch (err) {
        // For network errors, show empty array instead of error
        // This provides better UX when database is unreachable
        console.warn('Error fetching tracer updates:', err)
        setTracerUpdates([])
      } finally {
        setLoading(false)
      }
    }

    fetchTracerUpdates()
  }, [brandId, categoryId, subcategoryId, knowledgeId, sopId, qualityTrainingId, sourceTable, sourceKey])

  const getActionTypeColor = (actionType: string) => {
    switch (actionType.toUpperCase()) {
      case 'INSERT':
      case 'CREATE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTableName = (tableName: string) => {
    // Convert snake_case to Title Case
    return tableName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tracer updates...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {title || 'Tracer Updates'}
        </h2>
        <div className="text-sm text-gray-500">
          {brandId && `Brand ID: ${brandId}`}
          {categoryId && `Category ID: ${categoryId}`}
          {subcategoryId && `Subcategory ID: ${subcategoryId}`}
          {knowledgeId && `Knowledge ID: ${knowledgeId}`}
          {sopId && `SOP ID: ${sopId}`}
          {qualityTrainingId && `Quality Training ID: ${qualityTrainingId}`}
          {sourceTable && !brandId && !categoryId && !subcategoryId && !knowledgeId && !sopId && !qualityTrainingId && `Source: ${sourceTable}${sourceKey ? ` • ID: ${sourceKey}` : ''}`}
        </div>
      </div>

      {tracerUpdates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No tracer updates found for this record.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tracerUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header: Action Type and Date */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getActionTypeColor(
                        update.actionType
                      )}`}
                    >
                      {update.actionType.toUpperCase()}
                    </span>
                    <div className="text-sm font-medium text-gray-700">
                      {formatTableName(update.sourceTable)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(update.changedAt)}
                  </div>
                </div>

                {/* Field Name */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Field yang Berubah:</div>
                  <div className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {update.fieldName}
                  </div>
                </div>

                {/* Old and New Values */}
                {(update.oldValue !== null || update.newValue !== null) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {update.oldValue !== null && update.oldValue !== undefined && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Old Value:
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-gray-800 break-words whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {update.oldValue || <span className="text-gray-400 italic">(empty)</span>}
                        </div>
                      </div>
                    )}
                    {update.newValue !== null && update.newValue !== undefined && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          New Value:
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-800 break-words whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {update.newValue || <span className="text-gray-400 italic">(empty)</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Update Notes */}
                {update.updateNotes && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Update Notes:
                    </div>
                    <div className="text-sm text-yellow-900 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                      {update.updateNotes}
                    </div>
                  </div>
                )}

                {/* Footer: Changed By and Source Key */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {update.changedBy && (
                      <div>
                        <span className="font-semibold text-gray-700">Changed by: </span>
                        <span className="text-gray-900">{update.changedBy}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    ID: {update.sourceKey}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

