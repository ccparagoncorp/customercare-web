"use client"

import { Layout } from "@/components/agents/dashboard/Layout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import ImprovementForm from "@/components/improvement/ImprovementForm"
import improvementContent from "@/content/improvement.json"

export default function ImprovementPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen p-6 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
              <div className="text-center">
                <h1 className="md:text-6xl text-3xl font-bold text-[#ffde59] mb-4">
                  {improvementContent.hero.title}
                </h1>
                <p className="md:text-xl text-md text-[#ffde59]">
                  {improvementContent.hero.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6">
            <ImprovementForm />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

