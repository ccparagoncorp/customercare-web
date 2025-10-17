import { Layout, Content } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Content />
      </Layout>
    </ProtectedRoute>
  )
}
