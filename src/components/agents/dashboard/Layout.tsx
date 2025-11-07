"use client"

import { Header } from "../Header"
import { Sidebar } from "../Sidebar"
import FooterSection from "@/components/FooterSection"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <div className="min-h-screen bg-[#d6e5ff]">
        {/* Sidebar */}
        <Sidebar isOpen={false} onToggle={() => {}} />
        
        {/* Main Content */}
        <div className="ml-18">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main className="">
            {children}
          </main>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
