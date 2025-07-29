"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Mic, Send } from "lucide-react"

interface AIChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit: (message: string) => void
  placeholder?: string
  className?: string
}

export function AIChatInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  className = "",
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
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
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

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end space-x-2 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Attachment Button */}
        <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-gray-600 flex-shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 min-h-[40px] max-h-32 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent p-0"
          rows={1}
        />

        {/* Voice Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleVoiceToggle}
          className={`h-10 w-10 flex-shrink-0 ${
            isRecording ? "text-red-500 hover:text-red-600 bg-red-50" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="h-10 w-10 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 disabled:bg-gray-300 flex-shrink-0 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between mt-2 px-4 text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{inputValue.length}/2000</span>
      </div>
    </div>
  )
}
