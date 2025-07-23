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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleStartChat = (prompt: string) => {
    // This function will be called when user clicks on explore items
    // For now, we'll just log it - in a real app, this would trigger the chat
    console.log("Starting chat with prompt:", prompt)

    // You could implement logic here to:
    // 1. Navigate to the main chat page
    // 2. Set the initial message
    // 3. Open a chat modal

    // For demonstration, let's navigate to home with the chat active
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <ChatSidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} onStartChat={handleStartChat} />

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-80" : "ml-0"}`} style={{ paddingTop: "4rem" }}>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      <CFOChatWidget />
    </div>
  )
}
