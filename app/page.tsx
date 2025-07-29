"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calculator, FileText } from "lucide-react"
import { AIChatInput } from "@/components/ai-chat-input"

interface QuickPrompt {
  id: string
  text: string
  icon: React.ComponentType<{ className?: string }>
  category: "analysis" | "scenario" | "reporting"
}

interface ChatDashboardProps {
  onSendMessage?: (message: string) => void
  onOpenChat?: () => void
}

export default function ChatDashboard({ onSendMessage, onOpenChat }: ChatDashboardProps) {
  const [inputValue, setInputValue] = useState("")

  const quickPrompts: QuickPrompt[] = [
    {
      id: "nim-analysis",
      text: "Why did net interest margin improve this quarter?",
      icon: TrendingUp,
      category: "analysis",
    },
    {
      id: "provision-variance",
      text: "What drove the increase in loan loss provisions?",
      icon: TrendingUp,
      category: "analysis",
    },
    {
      id: "scenario-growth",
      text: "What if loan growth was 15% next quarter?",
      icon: Calculator,
      category: "scenario",
    },
    {
      id: "board-summary",
      text: "Generate executive summary for Q3 results",
      icon: FileText,
      category: "reporting",
    },
    {
      id: "peer-comparison",
      text: "How do we compare to industry peers on ROE?",
      icon: TrendingUp,
      category: "analysis",
    },
    {
      id: "efficiency-metrics",
      text: "Analyze our cost-to-income ratio trends",
      icon: Calculator,
      category: "analysis",
    },
  ]

  const handlePromptClick = (prompt: QuickPrompt) => {
    if (onSendMessage) {
      onSendMessage(prompt.text)
    }
  }

  const handleInputSubmit = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "analysis":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "scenario":
        return "bg-green-50 text-green-700 border-green-200"
      case "reporting":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Main Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">What can I help with?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered earnings assistant for banking insights, variance analysis, and strategic planning.
          </p>
        </div>

        {/* Chat Input */}
        <div className="w-full max-w-2xl mx-auto">
          <AIChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleInputSubmit}
            placeholder="Ask about earnings, run scenarios, or request analysis..."
            className="w-full"
          />
        </div>

        {/* Quick Prompts */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Popular questions</h2>
            <p className="text-sm text-gray-600">Get started with these common financial analysis queries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {quickPrompts.map((prompt) => {
              const IconComponent = prompt.icon
              return (
                <Card
                  key={prompt.id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-200 hover:border-apple-blue-300"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-apple-blue-50 rounded-lg flex-shrink-0 group-hover:bg-apple-blue-100 transition-colors">
                        <IconComponent className="h-5 w-5 text-apple-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-relaxed group-hover:text-apple-blue-900 transition-colors">
                          {prompt.text}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-2 text-xs ${getCategoryColor(prompt.category)} capitalize`}
                        >
                          {prompt.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Hint */}
        <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
          <p>
            Start a conversation above or explore your{" "}
            <button
              onClick={onOpenChat}
              className="text-apple-blue-600 hover:text-apple-blue-700 font-medium underline"
            >
              recent conversations
            </button>{" "}
            to continue where you left off.
          </p>
        </div>
      </div>
    </div>
  )
}
