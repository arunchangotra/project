"use client"

import { useState } from "react"
import { TrendingUp, Calculator, FileText, BarChart3 } from "lucide-react"
import { AIChatInput } from "@/components/ai-chat-input"

export default function HomePage() {
  const [input, setInput] = useState("")

  const quickPrompts = [
    {
      icon: TrendingUp,
      text: "Why did net interest margin improve this quarter?",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      icon: Calculator,
      text: "What would happen if we reduce loan loss provisions by 10%?",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      icon: FileText,
      text: "Generate executive summary for board presentation",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      icon: BarChart3,
      text: "Compare our ROE with industry benchmarks",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    },
  ]

  const handlePromptClick = (promptText: string) => {
    setInput(promptText)
  }

  const handleSubmit = (message: string) => {
    console.log("Submitted message:", message)
    // Handle the chat submission here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">What can I help with?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered earnings assistant for comprehensive financial analysis and insights
          </p>
        </div>

        {/* Chat Input */}
        <div className="mb-8">
          <AIChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Ask about earnings, variance analysis, scenarios, or request board deck content..."
          />
        </div>

        {/* Quick Prompts */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Popular questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickPrompts.map((prompt, index) => {
              const IconComponent = prompt.icon
              return (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt.text)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${prompt.color}`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 mt-0.5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">{prompt.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Hint */}
        <div className="text-center text-gray-500">
          <p className="text-sm">Start a conversation or explore our tools to get financial insights</p>
        </div>
      </div>
    </div>
  )
}
