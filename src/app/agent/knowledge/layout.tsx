import { Layout } from '@/components/agents/dashboard/Layout'

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>
    <div className="p-6">
      {children}
    </div>
  </Layout>
}
