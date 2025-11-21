import { FileText, ChevronRight, Shield } from "lucide-react"
import { JenisQualityTraining } from "./types"

interface QAAgentCardsProps {
  jenisQualityTrainings: JenisQualityTraining[]
  onCardClick: (jenis: JenisQualityTraining) => void
}

export function QAAgentCards({ jenisQualityTrainings, onCardClick }: QAAgentCardsProps) {
  return (
    <div className="mt-8 md:mx-24 mx-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jenisQualityTrainings.map((jenis, index) => (
          <div
            key={jenis.id}
            onClick={() => onCardClick(jenis)}
            className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-2 border-blue-200 hover:border-blue-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-[#1e3a8a] group-hover:text-blue-700 transition-colors mb-3 line-clamp-2">
                {jenis.name}
              </h3>
              
              {/* Description */}
              {jenis.description && (
                <p className="text-blue-700/80 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {jenis.description}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-blue-200 group-hover:border-blue-400 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">{jenis.detailQualityTrainings.length}</span>
                  <span className="text-blue-600">
                    {jenis.detailQualityTrainings.length !== 1 ? 'Details' : 'Detail'}
                  </span>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full border border-blue-300">
                  <span className="text-xs font-medium text-blue-700">View</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

