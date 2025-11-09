"use client"

import Link from "next/link"
import { History } from "lucide-react"

interface TracerButtonProps {
  href: string
  className?: string
}

export function TracerButton({ href, className = "" }: TracerButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md ${className}`}
    >
      <History className="w-4 h-4" />
      <span>Tracer Updates</span>
    </Link>
  )
}

