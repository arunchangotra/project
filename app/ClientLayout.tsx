"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - only rendered once here */}
      <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pt-16">{children}</main>
    </div>
  )
}
