"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface AIChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
}

export function AIChatInput({ value, onChange, onSend, placeholder = "Ask me anything..." }: AIChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex items-end space-x-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 min-h-[40px] max-h-[120px] resize-none border-gray-300 focus:border-apple-blue-500 focus:ring-apple-blue-500"
        rows={1}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim()}
        className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white px-3 py-2 h-10"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
