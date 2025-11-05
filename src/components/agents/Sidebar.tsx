"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Lightbulb, Settings, Clipboard, Calendar, Megaphone, Trophy, BarChart3, LogOut } from "lucide-react"
import dashboardContent from "@/content/agent/dashboard.json"
import { KnowledgeBaseSubmenu } from "./KnowledgeBaseSubmenu"
import { QualityTrainingSubmenu } from "./QualityTrainingSubmenu"

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

const navigationItems = [
  { icon: Home, label: "Home", href: "/agent/dashboard" },
  { icon: BookOpen, label: "Knowledge Base", href: "/agent/knowledge" },
  { icon: Lightbulb, label: "Product Knowledge", href: "/agent/products" },
  { icon: Settings, label: "SOP & Workflows", href: "/agent/sop" },
  { icon: Clipboard, label: "Quality & Training", href: "/agent/dashboard/training" },
  { icon: Calendar, label: "Scheduling & WFM", href: "/agent/dashboard/scheduling" },
  { icon: Megaphone, label: "Announcements", href: "/agent/dashboard/announcements" },
  { icon: Trophy, label: "Achievements & People", href: "/agent/dashboard/achievements" },
  { icon: BarChart3, label: "Improvements", href: "/agent/dashboard/improvements" },
]

export function Sidebar({ isOpen = false, onToggle }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  // Map menu labels to image base names in public/sidebar
  // Active icon will use `${baseName}white.png`, inactive uses `${baseName}.png`
  const labelToBaseName: Record<string, string> = {
    "Home": "home",
    "Knowledge Base": "knowledgebase",
    "Product Knowledge": "productknowledge",
    "SOP & Workflows": "sop&workflows",
    "Quality & Training": "quality&training",
    "Scheduling & WFM": "scheduling",
    "Announcements": "announcement",
    "Achievements & People": "achievements",
    "Improvements": "improvements",
  }

  const getIconSrc = (label: string, isActive: boolean): string | null => {
    const base = labelToBaseName[label]
    if (!base) return null
    const suffix = isActive ? "white" : ""
    const file = suffix ? `${base}white.png` : `${base}.png`
    // handle special chars like & automatically by leaving as-is
    return `/sidebar/${file}`
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-name')
    localStorage.removeItem('user-role')
    localStorage.removeItem('agent-category')
    window.location.href = '/login'
  }

  return (
    <div 
      className={`z-100 bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 transition-all duration-300 ${isHovered ? 'w-60' : 'w-18'} h-screen flex flex-col fixed left-0 top-0 z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-center overflow-hidden">
          <div className="relative flex items-center justify-center" style={{ width: '133px', height: '39px' }}>
            <Image
              src="/logomini.png"
              alt="Logo"
              width={39}
              height={39}
              className="absolute rounded-lg transition-opacity duration-90 delay-100"
              style={{ opacity: isHovered ? 0 : 1 }}
            />
            <Image
              src="/logo.png"
              alt="Logo"
              width={133}
              height={39}
              className="absolute rounded-lg transition-opacity duration-90 delay-100"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const iconSrc = getIconSrc(item.label, isActive)
          const IconComponent = item.icon
          
          // Special handling for Knowledge Base with submenu
          if (item.label === "Knowledge Base") {
            // Check if current path is /agent/knowledge or starts with /agent/knowledge/
            const isKnowledgeActive = pathname === '/agent/knowledge' || pathname.startsWith('/agent/knowledge/')
            return (
              <KnowledgeBaseSubmenu 
                key={item.href}
                isHovered={isHovered}
                isActive={isKnowledgeActive}
              />
            )
          }

          // Special handling for Quality & Training with submenu
          if (item.label === "Quality & Training") {
            // QualityTrainingSubmenu will calculate its own active state based on quality training list
            // We don't pass isActive here, let it calculate internally
            return (
              <QualityTrainingSubmenu 
                key={item.href}
                isHovered={isHovered}
              />
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl transition-all duration-200 group relative px-4 py-3 ${
                isActive
                  ? 'bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white shadow-lg shadow-[#0259b7]/20'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#0259b7] hover:shadow-md'
              }`}
            >
              {isActive && isHovered && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <div className="mr-2 flex-shrink-0">
                {iconSrc ? (
                  <Image
                    src={iconSrc}
                    alt={item.label}
                    width={26}
                    height={26}
                  />
                ) : (
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#0259b7] group-hover:text-[#0259b7]'}`} />
                )}
              </div>
              <span 
                className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {item.label}
              </span>
              {isActive && isHovered && (
                <div className="ml-auto flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}