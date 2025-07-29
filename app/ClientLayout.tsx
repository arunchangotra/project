"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"
import { CFOChatWidget } from "@/components/cfo-chat-widget"
import { cn } from "@/lib/utils"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMaximized, setIsChatMaximized] = useState(false)
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Function to handle sending a message from anywhere in the app
  const handleSendInitialMessage = (message: string) => {
    setInitialChatMessage(message)
    setIsChatOpen(true)
    setIsChatMaximized(true)
  }

  // Function to handle opening the chat without a specific message
  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsChatMaximized(true)
  }

  // Clear initial message after it's been consumed by the chat interface
  useEffect(() => {
    if (isChatOpen && initialChatMessage) {
      const timer = setTimeout(() => setInitialChatMessage(null), 100)
      return () => clearTimeout(timer)
    }
  }, [isChatOpen, initialChatMessage])

  // Handle sidebar toggle
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Single Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Navigation onSidebarToggle={handleSidebarToggle} />
        </div>
      </header>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />

      {/* Main Content */}
      <main className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "ml-80" : "ml-0")}>{children}</main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Floating CFO Chat Widget - always available */}
      <CFOChatWidget
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isMaximized={isChatMaximized}
        setIsMaximized={setIsChatMaximized}
        initialMessage={initialChatMessage}
      />
    </div>
  )
}
