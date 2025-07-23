"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Maximize2, Minimize2 } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { cn } from "@/lib/utils"

interface CFOChatWidgetProps {
  initialMessage?: string | null
  onMessageProcessed?: () => void
}

export function CFOChatWidget({ initialMessage, onMessageProcessed }: CFOChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)

  // Handle initial message from sidebar explore clicks
  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage)
      setIsOpen(true)
      setIsMaximized(true)
      // Clear the message after processing
      if (onMessageProcessed) {
        onMessageProcessed()
      }
    }
  }, [initialMessage, onMessageProcessed])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMaximized(false)
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMaximized(false)
    setCurrentMessage(null)
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out",
            isMaximized ? "inset-4 md:inset-8" : "bottom-4 right-4 w-96 h-[500px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-apple-blue-600" />
              <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMaximize}
                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
              >
                {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden" style={{ height: "calc(100% - 73px)" }}>
            <ChatInterface isMaximized={isMaximized} initialMessage={currentMessage} />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </>
  )
}
