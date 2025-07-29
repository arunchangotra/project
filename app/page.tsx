"use client"

import { useState } from "react"
import { AIChatInput } from "@/components/ai-chat-input"
import { ChatInterface } from "@/components/chat-interface"
import { TrendingUp, FileText, Calculator } from "lucide-react"

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | null>(null)

  const handleSendMessage = (message: string) => {
    setInitialMessage(message)
    setShowChat(true)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInitialMessage(prompt)
    setShowChat(true)
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <ChatInterface initialMessage={initialMessage} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Main Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">What can I help with?</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Your AI-powered earnings assistant for banking insights, variance analysis, and strategic planning.
            </p>
          </div>

          {/* Chat Input */}
          <div className="w-full max-w-2xl">
            <AIChatInput
              onSendMessage={handleSendMessage}
              placeholder="Ask about earnings, run scenarios, or request analysis..."
            />
          </div>

          {/* Quick Prompts */}
          <div className="w-full max-w-4xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Popular questions</h2>
              <p className="text-gray-600">Get started with these common financial analysis queries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => handleQuickPrompt("Why did net interest margin improve this quarter?")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Why did net interest margin improve this quarter?
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Analysis
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickPrompt("What drove the increase in loan loss provisions?")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">What drove the increase in loan loss provisions?</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Analysis
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickPrompt("What if loan growth was 15% next quarter?")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <Calculator className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">What if loan growth was 15% next quarter?</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Scenario
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickPrompt("Generate executive summary for Q3 results")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Generate executive summary for Q3 results</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      Reporting
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickPrompt("How do we compare to industry peers on ROE?")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">How do we compare to industry peers on ROE?</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Analysis
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickPrompt("Analyze our cost-to-income ratio trends")}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-apple-blue-600 mt-0.5 group-hover:text-apple-blue-700" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Analyze our cost-to-income ratio trends</h3>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Analysis
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
