"use client"

import Link from "next/link"
import { Building2, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  onSidebarToggle?: (isOpen: boolean) => void
}

export function Navigation({ onSidebarToggle }: NavigationProps) {
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle(true)
    }
  }

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        <Button variant="ghost" size="icon" onClick={handleSidebarToggle} className="h-8 w-8 hover:bg-gray-100">
          <Menu className="h-4 w-4" />
        </Button>

        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
          <Building2 className="h-6 w-6 text-apple-blue-700" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">AI Earnings Assistant</span>
          <Badge
            variant="secondary"
            className="ml-2 text-xs px-2 py-0.5 rounded-full bg-apple-blue-100 text-apple-blue-700 border-apple-blue-200"
          >
            BETA
          </Badge>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Avatar Placeholder */}
        <div className="h-8 w-8 bg-apple-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">CF</span>
        </div>
      </div>
    </nav>
  )
}
