"use client"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
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
  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsMaximized(false)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setIsMaximized(false)
  }

  const handleMinimizeChat = () => {
    setIsMaximized(false)
  }

  const handleMaximizeChat = () => {
    setIsMaximized(true)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        isMaximized={isMaximized}
        onClose={handleCloseChat}
        onMinimize={handleMinimizeChat}
        onMaximize={handleMaximizeChat}
        initialMessage={initialMessage}
      />
    </>
  )
}
