"use client"

import Image from "next/image"
import { ChevronUp, ChevronDown, ExternalLink, Check, X } from "lucide-react"
import { JenisQualityTraining, DetailQualityTraining } from "./types"
import { createSlug, getJenisDesignConfig, getSlideEmbedUrl } from "./utils"
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
  // Determine section wrapper classes based on design config - QA Agent style
  const getSectionWrapperClasses = (designConfig: ReturnType<typeof getJenisDesignConfig>) => {
    if (designConfig.type === 'quality-of-services') {
      return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-blue-50 to-indigo-100"
    }
    if (designConfig.type === 'tips-tricks-customer-services') {
      return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-blue-100 to-indigo-200"
    }
    if (designConfig.type === 'behaviour-customer-service') {
      return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-indigo-50 to-blue-100"
    }
    if (designConfig.type === 'faq') {
      return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-blue-50 to-indigo-50"
    }
    return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-blue-50 to-indigo-50"
  }

  // Determine section header classes based on design config - QA Agent style
  const getSectionHeaderClasses = (designConfig: ReturnType<typeof getJenisDesignConfig>) => {
    if (designConfig.type === 'quality-of-services') {
      return "bg-gradient-to-r from-blue-600 to-indigo-600 p-4 pt-24"
    }
    if (designConfig.type === 'tips-tricks-customer-services') {
      return "bg-gradient-to-r from-blue-500 to-indigo-500 p-4 pt-24"
    }
    if (designConfig.type === 'behaviour-customer-service') {
      return "bg-gradient-to-r from-indigo-600 to-blue-600 p-4 pt-24"
    }
    if (designConfig.type === 'all-materi-training') {
      return "bg-gradient-to-r from-blue-700 to-indigo-800 px-0 py-4 pt-24"
    }
    if (designConfig.type === 'faq') {
      return "bg-gradient-to-r from-blue-600 to-indigo-600 p-4 pt-24"
    }
    return "bg-gradient-to-r from-blue-600 to-indigo-700 p-4 pb-12 pt-24"
  }

  // Determine section content classes based on design config - QA Agent style
  const getSectionContentClasses = (designConfig: ReturnType<typeof getJenisDesignConfig>) => {
    if (designConfig.type === 'quality-of-services') {
      return "bg-gradient-to-r from-blue-500 to-indigo-500 p-4 pb-32"
    }
    if (designConfig.type === 'sop-pelaporan-eskos') {
      return "bg-gradient-to-r from-blue-700 to-indigo-800 p-4 pb-0"
    }
    if (designConfig.type === 'all-materi-training') {
      return "p-0"
    }
    if (designConfig.type === 'tips-tricks-customer-services') {
      return "bg-gradient-to-br from-blue-100 to-indigo-200 p-8 pb-32"
    }
    if (designConfig.type === 'behaviour-customer-service') {
      return "bg-gradient-to-b from-indigo-600 to-blue-700 p-8 pb-32"
    }
    if (designConfig.type === 'faq') {
      return "bg-gradient-to-b from-blue-600 to-indigo-700 p-8 pb-32"
    }
    return "bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-24"
  }

  const renderSectionContent = (jenis: JenisQualityTraining, designConfig: ReturnType<typeof getJenisDesignConfig>) => {
    // SOP Pelaporan Eskos - Display logos
    if (designConfig.type === 'sop-pelaporan-eskos') {
      return (
        <div className="flex flex-wrap justify-center items-center gap-8">
          {jenis.logos && jenis.logos.length > 0 ? (
            jenis.logos.map((logo, logoIndex) => (
              <div key={logoIndex} className="flex items-center justify-center">
                <QualityTrainingImage item={{ logos: [logo] }} size="w-full h-auto" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-white/80">
              No logos available
            </div>
          )}
        </div>
      )
    }

    // Tips & Tricks Customer Services - Centered cards using flex
    if (designConfig.type === 'tips-tricks-customer-services' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      return (
        <div className="flex flex-wrap justify-center gap-6">
          {jenis.detailQualityTrainings.map((detail) => (
            <div
              key={detail.id}
              className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-blue-400 hover:border-blue-300 transform hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(20%-1.25rem)] max-w-sm"
            >
              <div className="flex flex-col items-center justify-center gap-3 mb-4">
                {detail.logos && detail.logos[0] && (
                  <Image src={detail.logos[0]} alt={detail.name} width={200} height={200} />
                )}
                <h3 className="text-xl text-center font-bold text-white mb-2 line-clamp-2">
                  {detail.name}
                </h3>
              </div>
              {detail.description && (
                <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {detail.description}
                </p>
              )}
              {detail.linkslide && (
                <a
                  href={detail.linkslide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Slide</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }

    // Behaviour Customer Care - Modern card grid layout
    if (designConfig.type === 'behaviour-customer-service' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
          {jenis.detailQualityTrainings.map((detail) => (
            <div
              key={detail.id}
              className="group bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-400 hover:border-blue-300 transform hover:-translate-y-2"
            >
              {/* Image Section */}
              {detail.logos && detail.logos[0] && (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Image 
                    src={detail.logos[0]} 
                    alt={detail.name} 
                    width={400} 
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-1/6 items-center justify-center text-center">
                    <h3 className="md:text-9xl text-6xl font-black text-blue-200 mb-3 line-clamp-2 group-hover:text-blue-100 transition-colors">
                      {detail.name[0]}
                    </h3>
                  </div>
                  <div>
                    <h3 className="md:text-3xl text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-100 transition-colors">
                      {detail.name}
                    </h3>
                    
                    {detail.description && (
                      <p className="text-white md:text-lg text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-4">
                        {detail.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Subdetails */}
                {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => toggleDetails(detail.id)}
                      className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <span className="font-bold text-sm">View Details ({detail.subdetailQualityTrainings.length})</span>
                      <div className="flex items-center gap-2">
                        {expandedDetails.has(detail.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    
                    {expandedDetails.has(detail.id) && (
                      <div className="mt-4 space-y-3">
                        {detail.subdetailQualityTrainings.map((subdetail) => (
                          <div key={subdetail.id} className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                <div className="flex-shrink-0">
                                  <QualityTrainingImage item={subdetail} size="w-24 h-24" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm text-blue-700 font-medium mb-2">{subdetail.name}</p>
                                {subdetail.description && (
                                  <p className="text-blue-600/80 text-sm leading-relaxed whitespace-pre-line">
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
                
                {/* Link Slide */}
                {detail.linkslide && (
                  <a
                    href={detail.linkslide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors text-sm font-medium w-full justify-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Slide</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // All Materi Training - Slides only, 2-column grid with pair coloring
    if ((designConfig.type === 'all-materi-training') && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      const slideDetails = jenis.detailQualityTrainings.filter(d => !!d.linkslide)
      const pairs: DetailQualityTraining[][] = []
      for (let i = 0; i < slideDetails.length; i += 2) {
        pairs.push(slideDetails.slice(i, i + 2))
      }
      const pairThemes = [
        { wrapper: 'from-blue-700 to-indigo-800', badge: 'from-blue-400 to-indigo-500' },
        { wrapper: 'from-indigo-700 to-blue-800', badge: 'from-indigo-400 to-blue-500' },
      ]
      return (
        <div className="w-full">
          {pairs.map((pair, pairIndex) => {
            const theme = pairThemes[pairIndex % pairThemes.length]
            const isLastPairWithOneItem = pairIndex === pairs.length - 1 && pair.length === 1
            return (
              <div key={pairIndex} className={`w-full bg-gradient-to-r ${theme.wrapper}`}>
                <div className="p-16 md:px-48 px-4">
                  <div className={`grid gap-6 ${isLastPairWithOneItem ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {pair.map((d) => (
                      <div key={d.id} className={isLastPairWithOneItem ? 'w-full' : ''}>
                        <div className={`rounded-2xl border-2 border-blue-300/30 shadow-lg overflow-hidden bg-gradient-to-b ${theme.wrapper}`}>
                          <h4 className="text-white font-bold md:text-3xl text-xl justify-center text-center my-4">{d.name}</h4>

                          {/* Responsive 16:9 iframe */}
                          <div className="relative w-full pb-[56.25%]">
                            <iframe
                              src={getSlideEmbedUrl(d.linkslide as string)}
                              className="absolute inset-0 w-full h-full border-0 rounded-b-2xl p-4 bg-white"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                              loading="lazy"
                            />
                            <div className="p-4 flex items-center justify-between absolute top-2 right-2">
                              <a
                                href={d.linkslide as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white text-white text-xs bg-blue-600/80 hover:bg-blue-500/90 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 " /> <span className="text-sm font-bold">Open</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    // Quality of Services and other types that need detailQualityTrainings
    if (jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      // Quality of Services - Split two columns layout
      if (designConfig.type === 'quality-of-services' && designConfig.layout === 'split-two-columns' && jenis.detailQualityTrainings.length === 2) {
        const [firstDetail, secondDetail] = jenis.detailQualityTrainings
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-10 items-stretch">
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Check className="h-10 w-10 text-white bg-green-500 rounded-full flex-shrink-0 p-1" />
                <h3 className="md:text-4xl text-2xl font-black text-white">{firstDetail.name}</h3>
              </div>

              {/* First Detail - Do's (with Check icon) */}
              <div className="bg-white rounded-lg p-6 px-12 shadow-sm border-2 border-blue-200 flex-1 flex flex-col">
                <div>
                  {firstDetail.description && (
                    <p className="text-blue-800 md:text-lg text-sm font-bold md:leading-10 leading-7 whitespace-pre-line">
                      {firstDetail.description}
                    </p>
                  )}
                  {firstDetail.linkslide && (
                    <a
                      href={firstDetail.linkslide}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">Open Slide</span>
                    </a>
                  )}
                  {/* SubdetailQualityTrainings for first detail */}
                  {firstDetail.subdetailQualityTrainings && firstDetail.subdetailQualityTrainings.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleDetails(firstDetail.id)}
                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <span className="font-bold text-sm">View Subdetails</span>
                        <div className="flex items-center gap-2">
                          {expandedDetails.has(firstDetail.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      {expandedDetails.has(firstDetail.id) && (
                        <div className="mt-6 space-y-4">
                          {firstDetail.subdetailQualityTrainings.map((subdetail) => (
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
              </div>
            </div>

            {/* Second Detail - Don'ts (with X icon) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 mb-4">
                <X className="h-10 w-10 text-white bg-red-500 rounded-full flex-shrink-0 p-1" />
                <h3 className="md:text-4xl text-2xl font-black text-white">{secondDetail.name}</h3>
              </div>
              
              <div className="bg-white rounded-lg p-6 px-12 shadow-sm border-2 border-blue-200 flex-1 flex flex-col">
                {secondDetail.description && (
                  <p className="text-blue-800 md:text-lg text-sm font-bold md:leading-10 leading-7 whitespace-pre-line">
                    {secondDetail.description}
                  </p>
                )}
                {secondDetail.linkslide && (
                  <a
                    href={secondDetail.linkslide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">Open Slide</span>
                  </a>
                )}
                {/* SubdetailQualityTrainings for second detail */}
                {secondDetail.subdetailQualityTrainings && secondDetail.subdetailQualityTrainings.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleDetails(secondDetail.id)}
                      className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <span className="font-bold text-sm">View Subdetails</span>
                      <div className="flex items-center gap-2">
                        {expandedDetails.has(secondDetail.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {expandedDetails.has(secondDetail.id) && (
                      <div className="mt-6 space-y-4">
                        {secondDetail.subdetailQualityTrainings.map((subdetail) => (
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
            </div>
          </div>
        )
      }
    }

    // FAQ Layout - List with expandable descriptions
    if (designConfig.type === 'faq' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
      return (
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {jenis.detailQualityTrainings.map((detail) => (
            <div
              key={detail.id}
              className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-200 overflow-hidden"
            >
              {/* Question Header - Always Visible */}
              <button
                onClick={() => toggleDetails(detail.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  <h3 className="md:text-lg text-base font-black text-blue-800 flex-1">
                    {detail.name}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4 items-end justify-end">
                  {expandedDetails.has(detail.id) ? (
                    <ChevronUp className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-8 h-8 text-blue-400" />
                  )}
                </div>
              </button>

              {/* Answer/Description - Expandable */}
              {expandedDetails.has(detail.id) && (
                <div className="pb-6 pt-0 mx-6 border-t-2 border-blue-600 animate-fade-in">
                  <div className="pt-4">
                    {detail.description && (
                      <p className="text-blue-800 leading-relaxed whitespace-pre-line mb-4">
                        {detail.description}
                      </p>
                    )}
                    
                    {/* Link Slide if available */}
                    {detail.linkslide && (
                      <a
                        href={detail.linkslide}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open Slide</span>
                      </a>
                    )}

                    {/* Images if available */}
                    {detail.logos && detail.logos.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {detail.logos.map((logo, logoIndex) => (
                          <div key={logoIndex} className="relative rounded-lg overflow-hidden border-2 border-blue-200">
                            <QualityTrainingImage item={{ logos: [logo] }} size="w-full h-48" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SubdetailQualityTrainings if available */}
                    {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                      <div className="mt-6 space-y-3">
                        {detail.subdetailQualityTrainings.map((subdetail) => (
                          <div
                            key={subdetail.id}
                            className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-4 border-l-4 border-blue-600"
                          >
                            <div className="flex items-start gap-3">
                              {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                <div className="flex-shrink-0">
                                  <QualityTrainingImage item={subdetail} size="w-20 h-20" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-blue-700 mb-1">
                                  {subdetail.name}
                                </p>
                                {subdetail.description && (
                                  <p className="text-sm text-blue-600 leading-relaxed whitespace-pre-line">
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
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }
      
    // Default layout - vertical stack
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
                {detail.linkslide && (
                  <a
                    href={detail.linkslide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">Open Slide</span>
                  </a>
                )}
              </div>

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

    // If no detailQualityTrainings and not sop-pelaporan-eskos
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
        const designConfig = getJenisDesignConfig(jenis.name)
        
        return (
          <div
            key={jenis.id}
            id={sectionId}
            ref={(el) => {
              sectionRefs.current[jenis.id] = el
            }}
            className={getSectionWrapperClasses(designConfig)}
          >
            {/* Section Banner Header */}
            <div className={getSectionHeaderClasses(designConfig)}>
              <h2 className={
                designConfig.type === 'tips-tricks-customer-services' 
                  ? 'md:text-6xl text-3xl font-extrabold text-blue-900 text-center' 
                  : 'md:text-6xl text-3xl font-extrabold text-white text-center'
              }>{jenis.name}</h2>
              {jenis.description && (
                <p className="text-white/90 text-center mt-2">{jenis.description}</p>
              )}
            </div>

            {/* Section Content */}
            <div className={getSectionContentClasses(designConfig)}>
              {renderSectionContent(jenis, designConfig)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

