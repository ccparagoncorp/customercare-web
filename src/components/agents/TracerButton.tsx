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
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#ffde59] text-white rounded-lg hover:bg-[#ffde59]/30 transition-colors shadow-sm hover:shadow-md ${className}`}
    >
      <History className="w-4 h-4" />
      <span className="text-[#121269] font-medium">Tracer Updates</span>
    </Link>
  )
}

