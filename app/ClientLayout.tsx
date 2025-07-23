"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"
import { CFOChatWidget } from "@/components/cfo-chat-widget"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState<string | null>(null)

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen)
  }

  const handleExploreClick = (prompt: string) => {
    setChatMessage(prompt)
    // Close sidebar after clicking explore item
    setIsSidebarOpen(false)
  }

  // Clear the chat message after it's been processed
  const clearChatMessage = () => {
    setChatMessage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />
      <ChatSidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} onExploreClick={handleExploreClick} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-0"}`}>
        <main className="pt-16">{children}</main>
      </div>

      <CFOChatWidget initialMessage={chatMessage} onMessageProcessed={clearChatMessage} />
    </div>
  )
}
