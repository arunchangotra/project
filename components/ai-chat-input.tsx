"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Mic, Send } from "lucide-react"

interface AIChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export function AIChatInput({
  onSendMessage,
  placeholder = "Ask about earnings, run scenarios, or request analysis...",
  disabled = false,
}: AIChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="w-full">
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-apple-blue-300 focus-within:ring-1 focus-within:ring-apple-blue-300">
        <div className="flex items-start p-4 space-x-3">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 flex-shrink-0 mt-1"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 min-h-[20px] max-h-32 resize-none border-0 p-0 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          {/* Voice Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            className={`h-8 w-8 flex-shrink-0 mt-1 ${
              isRecording ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
            }`}
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-8 w-8 bg-apple-blue-600 hover:bg-apple-blue-700 disabled:bg-gray-300 flex-shrink-0 mt-1"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between mt-2 px-2">
        <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
        <p className="text-xs text-gray-400">{message.length}/2000</p>
      </div>
    </div>
  )
}
