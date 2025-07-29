"use client"

import { Button } from "@/components/ui/button"
import { Menu, Building2, MessageSquare } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export function Navigation({ isSidebarOpen, setIsSidebarOpen }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-8 w-8">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-apple-blue-600" />
            <span className="text-lg font-semibold text-gray-900">AI Earnings Assistant</span>
            <span className="px-2 py-1 text-xs font-medium bg-apple-blue-100 text-apple-blue-700 rounded-full">
              BETA
            </span>
          </Link>
        </div>

        {/* Right side - Chat and User */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </Button>

          <div className="h-8 w-8 bg-apple-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">CF</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
