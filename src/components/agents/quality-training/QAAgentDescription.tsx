import { FileText } from "lucide-react"
import { QualityTraining } from "./types"

interface QAAgentDescriptionProps {
  qualityTraining: QualityTraining
}

export function QAAgentDescription({ qualityTraining }: QAAgentDescriptionProps) {
  if (!qualityTraining.description) return null

  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8 mx-24 shadow-lg">
      <h2 className="md:text-3xl text-xl font-bold text-[#1e3a8a] mb-4 flex items-center">
        <FileText className="h-8 w-8 mr-3 text-blue-600" />
        Description
      </h2>
      <div className="text-[#1e3a8a]/90 leading-relaxed md:text-lg text-md">
        {qualityTraining.description}
      </div>
    </div>
  )
}

