"use client"

import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatInterface } from "./chat-interface"

interface CFOChatWidgetProps {
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
  isMaximized: boolean
  setIsMaximized: (isMax: boolean) => void
  initialMessage: string | null
  onBackToDashboard?: () => void
}

export function CFOChatWidget({
  isChatOpen,
  setIsChatOpen,
  isMaximized,
  setIsMaximized,
  initialMessage,
  onBackToDashboard,
}: CFOChatWidgetProps) {
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev)
    if (!isChatOpen) {
      setIsMaximized(false) // Always start minimized when opening from closed
    }
  }

  const minimizeWindow = () => {
    setIsMaximized(false)
  }

  const maximizeWindow = () => {
    setIsMaximized(true)
  }

  const closeChat = () => {
    setIsChatOpen(false)
    setIsMaximized(false)
    onBackToDashboard?.() // Go back to dashboard when closing chat
  }

  const exportChat = () => {
    const dummyContent = "CFO Chat conversation export (simulated)."
    const blob = new Blob([dummyContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cfo-chat-export.txt"
    a.click()
  }

  return (
    <>
      {/* Overlay for maximized state */}
      {isChatOpen && isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-lg transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}

      {/* Chat Window Container - Full screen when maximized */}
      <div
        className={cn(
          "fixed z-50 bg-white shadow-xl flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          // Always full screen when open
          isChatOpen ? "inset-0" : "opacity-0 pointer-events-none inset-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">AI Earnings Assistant</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={exportChat}
              className="h-8 w-8 text-gray-600 hover:bg-gray-100"
              aria-label="Export chat"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="h-8 w-8 text-gray-600 hover:bg-gray-100"
              aria-label="Close chat window"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface isMaximized={true} initialMessage={initialMessage} />
        </div>
      </div>
    </>
  )
}
