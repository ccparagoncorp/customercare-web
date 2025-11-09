import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { TracerUpdateDisplay } from "@/components/agents/TracerUpdateDisplay"

export default function SOPTracerPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <a
                  href="/agent/sop"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </a>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - SOP</h1>
                  <p className="text-gray-500 mt-1">View all updates for SOP categories</p>
                </div>
              </div>

              <TracerUpdateDisplay 
                sourceTable="kategori_sops" 
                title="Tracer Updates for SOP Categories"
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

