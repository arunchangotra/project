"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { CFOChatWidget } from "@/components/cfo-chat-widget"
import { AIChatInput } from "@/components/ai-chat-input"
import { cn } from "@/lib/utils" // Import cn utility

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMaximized, setIsChatMaximized] = useState(false)
  const [initialChatMessage, setInitialChatMessage] = useState<string | null>(null)

  // Function to handle sending a message from the fixed input bar
  const handleSendInitialMessage = (message: string) => {
    setInitialChatMessage(message)
    setIsChatOpen(true) // Open the floating chat
    setIsChatMaximized(true) // Open directly in maximized view
  }

  // Function to handle opening the chat without a specific message (e.g., from '+' or 'Tools')
  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsChatMaximized(true) // Open directly in maximized view
  }

  // Clear initial message after it's been consumed by the chat interface
  useEffect(() => {
    if (isChatOpen && initialChatMessage) {
      const timer = setTimeout(() => setInitialChatMessage(null), 100)
      return () => clearTimeout(timer)
    }
  }, [isChatOpen, initialChatMessage])

  return (
    <html lang="en">
      {/* Apply overflow-hidden to body when chat is maximized to prevent background scrolling */}
      <body className={cn(isChatMaximized && "overflow-hidden")}>
        <div className="flex flex-col min-h-screen bg-apple-gray-50">
          <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
              <Navigation />
            </div>
          </header>
          <main className="flex-1 container mx-auto py-12 px-4 md:px-6 pb-32">{children}</main>
        </div>
        {/* Render the fixed AI Chat Input only when the floating chat is NOT open */}
        {!isChatOpen && <AIChatInput onSendInitialMessage={handleSendInitialMessage} onOpenChat={handleOpenChat} />}

        {/* Render the floating CFO Chat Widget */}
        <CFOChatWidget
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          isMaximized={isChatMaximized}
          setIsMaximized={setIsChatMaximized}
          initialMessage={initialChatMessage}
        />
      </body>
    </html>
  )
}
