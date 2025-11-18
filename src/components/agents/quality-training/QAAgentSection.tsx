"use client"

import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react"
import { JenisQualityTraining } from "./types"
import { createSlug } from "./utils"
import { QualityTrainingImage } from "./QualityTrainingImage"

interface QAAgentSectionProps {
  jenisQualityTrainings: JenisQualityTraining[]
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  expandedDetails: Set<string>
  toggleDetails: (detailId: string) => void
}

export function QAAgentSection({
  jenisQualityTrainings,
  sectionRefs,
  expandedDetails,
  toggleDetails,
}: QAAgentSectionProps) {
  const formatLink = (url?: string | null) => {
    if (!url) return "#"
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }
    return `https://${url}`
  }

  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null
    let normalized = url.trim()
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = `https://${normalized}`
    }

    const slideMatch = normalized.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/)
    if (slideMatch) {
      return `https://docs.google.com/presentation/d/${slideMatch[1]}/embed?start=false&loop=false&delayms=3000`
    }

    const docMatch = normalized.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/)
    if (docMatch) {
      return `https://docs.google.com/document/d/${docMatch[1]}/preview`
    }

    const sheetMatch = normalized.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
    if (sheetMatch) {
      return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}`
    }

    const driveMatch = normalized.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    }

    return null
  }

  const isEmbeddable = (url?: string | null): boolean => {
    if (!url) return false
    const lowerUrl = url.toLowerCase()
    return (
      lowerUrl.includes('docs.google.com/presentation') ||
      lowerUrl.includes('docs.google.com/document') ||
      lowerUrl.includes('docs.google.com/spreadsheets') ||
      lowerUrl.includes('drive.google.com/file')
    )
  }

  const renderLinkPreview = (link: string | null | undefined, title: string) => {
    if (!link) return null

    const embedUrl = getEmbedUrl(link)

    return (
      <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {title}
            </p>
            <p className="text-xs text-gray-500">
              {isEmbeddable(link) ? "Preview Dokumen" : "Tautan Eksternal"}
            </p>
          </div>
          <a
            href={formatLink(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in new tab</span>
          </a>
        </div>
        {embedUrl ? (
          <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-md">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Tidak dapat menampilkan pratinjau. Silakan buka di tab baru.
          </p>
        )}
      </div>
    )
  }

  const renderSectionContent = (jenis: JenisQualityTraining) => {
    // Display logos if available
    if (jenis.logos && jenis.logos.length > 0) {
      return (
        <div className="flex flex-wrap justify-center items-center gap-8">
          {jenis.logos.map((logo, logoIndex) => (
            <div key={logoIndex} className="flex items-center justify-center">
              <QualityTrainingImage item={{ logos: [logo] }} size="w-full h-auto" />
            </div>
          ))}
        </div>
      )
    }

    // Default layout - vertical stack for detailQualityTrainings
    if (jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      return (
        <div className="space-y-6">
          {jenis.detailQualityTrainings.map((detail) => (
            <div key={detail.id} className="bg-white p-6 shadow-sm border-2 border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{detail.name}</h3>
                  {detail.description && (
                    <p className="text-blue-700/80 text-sm leading-relaxed whitespace-pre-line">
                      {detail.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Link Preview */}
              {detail.linkslide && renderLinkPreview(detail.linkslide, detail.name)}

              {/* SubdetailQualityTrainings */}
              {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleDetails(detail.id)}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="font-bold text-sm">View Subdetails</span>
                    <div className="flex items-center gap-2">
                      {expandedDetails.has(detail.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {expandedDetails.has(detail.id) && (
                    <div className="mt-6 space-y-4">
                      {detail.subdetailQualityTrainings.map((subdetail) => (
                        <div key={subdetail.id} className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-4 border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                              <div className="flex-shrink-0">
                                <QualityTrainingImage item={subdetail} size="w-32 h-32" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-blue-800 font-medium mb-2">{subdetail.name}</p>
                              {subdetail.description && (
                                <p className="text-blue-700/80 text-sm leading-relaxed whitespace-pre-line">
                                  {subdetail.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    // If no detailQualityTrainings and no logos
    return (
      <div className="text-center py-8 text-blue-600/60">
        No details available for this training type
      </div>
    )
  }

  return (
    <div className="mt-24 space-y-0">
      {jenisQualityTrainings.map((jenis) => {
        const sectionId = createSlug(jenis.name)
        
        return (
          <div
            key={jenis.id}
            id={sectionId}
            ref={(el) => {
              sectionRefs.current[jenis.id] = el
            }}
            className="overflow-hidden scroll-mt-20 bg-gradient-to-br from-blue-50 to-indigo-50"
          >
            {/* Section Banner Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 pb-12 pt-24">
              <h2 className="md:text-6xl text-3xl font-extrabold text-white text-center">
                {jenis.name}
              </h2>
              {jenis.description && (
                <p className="text-white/90 text-center mt-2">{jenis.description}</p>
              )}
            </div>

            {/* Section Content */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-24">
              {renderSectionContent(jenis)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

