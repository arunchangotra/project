"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { CFOChatWidget } from "@/components/cfo-chat-widget"
import { cn } from "@/lib/utils"

export default function ClientLayout({
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

  // Add this function to handle sidebar toggle
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen)
  }

  return (
    <html lang="en">
      <body className={cn(isChatMaximized && "overflow-hidden")}>
        <div className="flex flex-col min-h-screen bg-apple-gray-50">
          <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
              <Navigation
                onSidebarToggle={handleSidebarToggle}
                onSendMessage={handleSendInitialMessage}
                onOpenChat={handleOpenChat}
              />
            </div>
          </header>
          <main
            className={cn(
              "flex-1 transition-all duration-300",
              isSidebarOpen
                ? "ml-80 mr-8 px-4 md:px-6 py-8" // When sidebar is open: left margin for sidebar space, right margin for balance, normal padding
                : "container mx-auto py-8 px-4 md:px-6", // When sidebar is closed: normal container behavior
            )}
          >
            {children}
          </main>
        </div>

        {/* Floating CFO Chat Widget - always available */}
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
