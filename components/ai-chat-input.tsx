"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (message: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  className,
  disabled = false,
}: AIChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isComposing, setIsComposing] = useState(false)

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim())
      onChange("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-end space-x-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:border-apple-blue-300 focus-within:ring-2 focus-within:ring-apple-blue-100 transition-all duration-200">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600 flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 min-h-[20px] max-h-32 resize-none border-0 p-0 text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          rows={1}
        />

        {/* Voice Input Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600 flex-shrink-0"
          disabled={disabled}
        >
          <Mic className="h-4 w-4" />
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="icon"
          className="h-8 w-8 bg-apple-blue-600 hover:bg-apple-blue-700 disabled:bg-gray-300 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Character count or other info */}
      <div className="flex justify-between items-center mt-2 px-3 text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{value.length}/2000</span>
      </div>
    </div>
  )
}
