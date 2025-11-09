"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "./TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Knowledge {
  id: string
  title: string
}

interface KnowledgeTracerContentProps {
  knowledgeSlug: string
}

export function KnowledgeTracerContent({ knowledgeSlug }: KnowledgeTracerContentProps) {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch(`/api/knowledge/${knowledgeSlug}`)
        if (res.ok) {
          const data = await res.json()
          setKnowledge(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchKnowledge()
  }, [knowledgeSlug])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!knowledge) {
    return <div className="text-center py-12 text-red-500">Knowledge not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/knowledge/${knowledgeSlug}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {knowledge.title}</h1>
          <p className="text-gray-500 mt-1">View all updates for this knowledge</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        knowledgeId={knowledge.id}
        title={`Tracer Updates for ${knowledge.title}`}
      />
    </div>
  )
}

