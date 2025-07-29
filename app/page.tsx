"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send, Sparkles } from "lucide-react"

export default function ChatDashboard() {
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickPrompts = [
    "Why did NIM improve this quarter?",
    "What drove the increase in provisions?",
    "How do we compare to peers on ROE?",
    "Explain the variance in fee income",
    "What if loan growth was 15%?",
    "Draft board summary for Q3 results",
  ]

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    setIsTyping(true)
    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false)
      // Here you would typically handle the chat interaction
      // For now, we'll just clear the input
      setChatInput("")
    }, 2000)
  }

  const handleQuickPrompt = (prompt: string) => {
    setChatInput(prompt)
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Main Header */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-apple-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">What can I help with?</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ask me anything about your Q3 2024 financial performance, or choose from the options below
        </p>
      </div>

      {/* Chat Input */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about earnings, metrics, comparisons, or scenarios..."
              className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base bg-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className="rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 h-10 w-10 p-0"
            >
              {isTyping ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Quick Questions</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-white text-sm px-4 py-2"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity Hint */}
      <div className="text-center py-8 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-4">Recent conversations and analysis will appear here</p>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-apple-blue-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
