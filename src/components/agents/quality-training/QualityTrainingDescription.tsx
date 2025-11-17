import { FileText } from "lucide-react"
import { QualityTraining } from "./types"

interface QualityTrainingDescriptionProps {
  qualityTraining: QualityTraining
}

export function QualityTrainingDescription({ qualityTraining }: QualityTrainingDescriptionProps) {
  if (!qualityTraining.description) return null

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mx-24">
      <h2 className="md:text-3xl text-xl font-bold text-[#064379] mb-4 flex items-center">
        <FileText className="h-8 w-8 mr-3" />
        Description
      </h2>
      <div className="text-[#064379]/90 leading-relaxed md:text-lg text-md">
        {qualityTraining.description}
      </div>
    </div>
  )
}

