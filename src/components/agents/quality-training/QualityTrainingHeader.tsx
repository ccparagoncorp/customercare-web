import { TracerButton } from "@/components/agents/TracerButton"
import { QualityTraining } from "./types"

interface QualityTrainingHeaderProps {
  qualityTraining: QualityTraining
  qualityTrainingName: string
}

export function QualityTrainingHeader({ qualityTraining, qualityTrainingName }: QualityTrainingHeaderProps) {
  return (
    <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl px-4 sm:px-6 lg:px-8 py-8 md:mx-24 mx-4">
      <div className="text-center">
        <h1 className="md:text-6xl text-3xl font-bold text-[#ffde59] mb-4">{qualityTraining.title}</h1>
      </div>
      <div className="flex justify-center mt-6">
        <TracerButton href={`/agent/${qualityTrainingName}/tracer`} className="" />
      </div>
    </div>
  )
}

