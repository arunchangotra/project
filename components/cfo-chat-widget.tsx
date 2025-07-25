"use client"

import { Button } from "@/components/ui/button"
import { Minimize2, Maximize2, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatInterface } from "./chat-interface"

interface CFOChatWidgetProps {
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
  isMaximized: boolean
  setIsMaximized: (isMax: boolean) => void
  initialMessage: string | null // New prop for initial message
}

export function CFOChatWidget({
  isChatOpen,
  setIsChatOpen,
  isMaximized,
  setIsMaximized,
  initialMessage,
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
    setIsMaximized(false) // Reset to default when closing
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
      {/* Mascot Button (removed as AIChatInput is the primary entry point) */}
      {/*
      {!isChatOpen && (
        <Button
          onClick={toggleChat}
          className={cn(
            "fixed bottom-8 right-8 z-50 rounded-full p-5 shadow-lg transition-all duration-300 ease-in-out",
            "bg-apple-blue-600 hover:bg-apple-blue-700 text-white",
          )}
          aria-label="Open CFO Chat"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      )}
      */}

      {/* Overlay for maximized state */}
      {isChatOpen && isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-lg transition-opacity duration-300 ease-in-out" // Ensure z-40 is between sidebar (z-20) and chat (z-50)
          aria-hidden="true"
        />
      )}

      {/* Chat Window Container */}
      <div
        className={cn(
          "fixed z-50 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          // Positioning and size based on isMaximized - increased sizes
          isMaximized
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[95vh] max-h-[95vh]" // Increased from 90% to 95%
            : "bottom-8 right-8 w-[450px] h-[700px] max-h-[700px]", // Increased width and height
          // Visibility
          isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        style={{
          transformOrigin: isMaximized ? "center" : "bottom right",
        }}
      >
        {/* Header - More compact */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b border-gray-200 flex-shrink-0", // Reduced padding
            isMaximized ? "bg-apple-gray-50" : "bg-white",
          )}
        >
          <h2 className="text-base font-semibold text-gray-800">
            {isMaximized ? "AI Earnings Assistant" : "CFO Chat"}
          </h2>{" "}
          {/* Smaller title */}
          <div className="flex space-x-1">
            {" "}
            {/* Reduced spacing */}
            {isMaximized ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={minimizeWindow}
                className="h-7 w-7 text-gray-600 hover:bg-gray-100" // Smaller buttons
                aria-label="Minimize chat window"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={maximizeWindow}
                className="h-7 w-7 text-gray-600 hover:bg-gray-100"
                aria-label="Maximize chat window"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={exportChat}
              className="h-7 w-7 text-gray-600 hover:bg-gray-100"
              aria-label="Export chat"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="h-7 w-7 text-gray-600 hover:bg-gray-100"
              aria-label="Close chat window"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Chat Content - maximized height */}
        <div className="flex-1 p-2 overflow-hidden min-h-0">
          {" "}
          {/* Reduced padding */}
          <ChatInterface isMaximized={isMaximized} initialMessage={initialMessage} />
        </div>
      </div>
    </>
  )
}
