"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (message: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function AIChatInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Ask about earnings, run scenarios, or request analysis...",
  className,
  disabled = false,
}: AIChatInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSubmit?.(inputValue.trim())
      setInputValue("")
      onChange?.("")

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleAttachment = () => {
    // File attachment logic would go here
    console.log("Attachment clicked")
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-apple-blue-500 focus-within:border-apple-blue-500">
        <div className="flex items-end space-x-3 p-4">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            disabled={disabled}
            className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 min-h-[20px] max-h-32 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent p-0"
            rows={1}
          />

          {/* Voice Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={cn(
              "h-8 w-8 flex-shrink-0 transition-colors",
              isRecording
                ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            )}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || disabled}
            className="h-8 w-8 p-0 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Helper Text */}
        <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputValue.length}/2000</span>
        </div>
      </div>
    </div>
  )
}
