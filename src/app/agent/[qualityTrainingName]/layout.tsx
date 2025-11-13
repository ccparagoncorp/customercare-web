import { Layout } from '@/components/agents/dashboard/Layout'

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>
    <div className="md:py-6 py-2">
      {children}
    </div>
  </Layout>
}
