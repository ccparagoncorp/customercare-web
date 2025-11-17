import { TracerButton } from "@/components/agents/TracerButton"
import { QualityTraining } from "./types"

interface QAAgentHeaderProps {
  qualityTraining: QualityTraining
  qualityTrainingName: string
}

export function QAAgentHeader({ qualityTraining, qualityTrainingName }: QAAgentHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] rounded-3xl px-4 sm:px-6 lg:px-8 py-8 md:mx-24 mx-4 shadow-2xl">
      <div className="text-center">
        <h1 className="md:text-6xl text-3xl font-bold text-white mb-4 drop-shadow-lg">{qualityTraining.title}</h1>
      </div>
      <div className="flex justify-center mt-6">
        <TracerButton href={`/agent/${qualityTrainingName}/tracer`} className="" />
      </div>
    </div>
  )
}

