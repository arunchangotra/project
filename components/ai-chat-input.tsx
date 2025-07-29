"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit: (message: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function AIChatInput({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  className,
}: AIChatInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSubmit(inputValue.trim())
      setInputValue("")
      onChange?.("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleAttachment = () => {
    // File attachment logic would go here
    console.log("Attachment clicked")
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-end space-x-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-apple-blue-300 focus-within:ring-2 focus-within:ring-apple-blue-100">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAttachment}
          disabled={disabled}
          className="h-8 w-8 text-gray-400 hover:text-gray-600 flex-shrink-0"
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
          className="flex-1 min-h-[40px] max-h-[120px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm placeholder:text-gray-500 p-0"
          rows={1}
        />

        {/* Voice Recording Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          disabled={disabled}
          className={cn(
            "h-8 w-8 flex-shrink-0 transition-colors duration-200",
            isRecording ? "text-red-500 hover:text-red-600 bg-red-50" : "text-gray-400 hover:text-gray-600",
          )}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || disabled}
          className="h-8 w-8 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 disabled:bg-gray-300 flex-shrink-0 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between mt-2 px-3">
        <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
        <p className="text-xs text-gray-400">{inputValue.length}/2000</p>
      </div>
    </div>
  )
}
