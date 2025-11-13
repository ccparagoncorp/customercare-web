import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { KategoriSOPList } from "@/components/agents/sop/KategoriSOPList"
import { TracerButton } from "@/components/agents/TracerButton"
import sopContent from "@/content/agent/sop.json"

export default function SOPPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen p-6 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="md:text-6xl text-3xl font-bold text-[#ffde59] mb-4">{sopContent.page.title}</h1>
                <p className="md:text-xl text-md text-[#ffde59]">
                  {sopContent.page.description}
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <TracerButton href="/agent/sop/tracer" className="" />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12">
            <KategoriSOPList />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
