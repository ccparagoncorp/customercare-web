"use client"

import { useState } from "react"
import { Header } from "../Header"
import { Sidebar } from "../Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={false} onToggle={() => {}} />
      
      {/* Main Content */}
      <div className="ml-20">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
