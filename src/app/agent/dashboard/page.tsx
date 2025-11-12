"use client"


import { Content } from "@/components/agents/dashboard"
import { Sidebar } from "@/components/agents/Sidebar"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import FooterSection from "@/components/FooterSection"
import { Header } from "@/components/agents/Header"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Sidebar isOpen={false} onToggle={() => {}} />
      <Header />
      <main className="ml-12 mt-9 w-full">
        <Content />
      </main>
      <FooterSection />
    </ProtectedRoute>
  )
}
