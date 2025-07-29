"use client"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Maximize2, Minimize2 } from "lucide-react"
import { ChatInterface } from "./chat-interface"

interface CFOChatWidgetProps {
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
  isMaximized: boolean
  setIsMaximized: (maximized: boolean) => void
  initialMessage?: string | null
}

export function CFOChatWidget({
  isChatOpen,
  setIsChatOpen,
  isMaximized,
  setIsMaximized,
  initialMessage,
}: CFOChatWidgetProps) {
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const closeChat = () => {
    setIsChatOpen(false)
    setIsMaximized(false)
  }

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Earnings Assistant</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleMaximize} className="h-8 w-8">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="h-[calc(100vh-73px)]">
          <ChatInterface isMaximized={true} initialMessage={initialMessage} />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isChatOpen && !isMaximized && (
        <div className="fixed bottom-6 right-6 z-40 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMaximize} className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-[calc(100%-73px)]">
            <ChatInterface initialMessage={initialMessage} />
          </div>
        </div>
      )}
    </>
  )
}
