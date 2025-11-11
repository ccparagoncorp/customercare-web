"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "./TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface QualityTraining {
  id: string
  title: string
}

interface QualityTrainingTracerContentProps {
  qualityTrainingName: string
}

export function QualityTrainingTracerContent({ qualityTrainingName }: QualityTrainingTracerContentProps) {
  const [qualityTraining, setQualityTraining] = useState<QualityTraining | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQualityTraining = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/quality-training/${encodeURIComponent(qualityTrainingName)}`)
        if (res.ok) {
          const data = await res.json()
          setQualityTraining(data)
        } else {
          setError('Quality training not found')
        }
      } catch (err) {
        console.error('Error fetching quality training:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch quality training')
      } finally {
        setLoading(false)
      }
    }
    fetchQualityTraining()
  }, [qualityTrainingName])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error || !qualityTraining) {
    return <div className="text-center py-12 text-red-500">{error || 'Quality training not found'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/${qualityTrainingName}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {qualityTraining.title}</h1>
          <p className="text-gray-500 mt-1">View all updates for this quality training</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        qualityTrainingId={qualityTraining.id}
        title={`Tracer Updates for ${qualityTraining.title}`}
      />
    </div>
  )
}

