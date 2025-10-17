"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Only show header on specific pages
  const showHeaderPages = ["/", "/about", "/contact", "/faq"]
  
  if (!showHeaderPages.includes(pathname)) {
    return null
  }
  
  return <Header />
}
