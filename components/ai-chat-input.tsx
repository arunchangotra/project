"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Mic, BarChartHorizontalBig, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatInputProps {
  onSendInitialMessage: (message: string) => void
  onOpenChat: () => void
}

export function AIChatInput({ onSendInitialMessage, onOpenChat }: AIChatInputProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHeadline, setShowHeadline] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeadline(false)
    }, 2500) // Fade out after 2.5 seconds
    return () => clearTimeout(timer) // Cleanup on unmount
  }, []) // Empty dependency array means it runs once on mount

  const handleSend = () => {
    if (!input.trim()) return
    onSendInitialMessage(input) // Pass the message to the parent to open the chat
    setInput("")
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000) // Simulate loading
  }

  const handlePlusOrToolsClick = () => {
    onOpenChat() // Just open the chat without sending a message
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.8)_70%,_rgba(255,255,255,1)_100%)] pointer-events-none" />

      <div className="relative container mx-auto max-w-3xl flex flex-col items-center">
        <h2
          className={cn(
            "text-xl font-semibold text-gray-800 mb-4 transition-all duration-500 ease-out",
            showHeadline ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden pointer-events-none mb-0",
          )}
        >
          What's on your mind today?
        </h2>
        <div className="relative flex w-full items-center rounded-full border border-gray-300 bg-white/80 pr-2 shadow-sm transition-all duration-300 hover:bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={handlePlusOrToolsClick}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="h-10 px-3 text-gray-500 hover:bg-gray-100"
            onClick={handlePlusOrToolsClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Tools
          </Button>
          <Input
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            className="flex-1 h-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-2"
          />
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100">
            <Mic className="h-5 w-5" />
          </Button>
          {input.trim() ? (
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="h-10 w-10 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100">
              <BarChartHorizontalBig className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
