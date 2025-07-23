"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Search,
  Send,
  Sparkles,
  Target,
  Users,
  DollarSign,
  Activity,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  chatPrompt: string // Changed from route/action to chatPrompt
}

interface ChatDashboardProps {
  onSendMessage: (message: string) => void
  onOpenChat: () => void
}

export default function ChatDashboard({ onSendMessage, onOpenChat }: ChatDashboardProps) {
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const featureCards: FeatureCard[] = [
    {
      id: "earnings-overview",
      title: "Earnings Overview",
      description: "Get quarterly performance snapshots and KPI summaries",
      icon: BarChart3,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      chatPrompt: "Show me the Q3 2024 earnings overview with key performance indicators and quarterly snapshots",
    },
    {
      id: "variance-analysis",
      title: "Variance Analysis",
      description: "Drill down into specific changes with AI explanations",
      icon: TrendingUp,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      chatPrompt: "Analyze the variance in our Q3 2024 financial metrics and explain the key changes",
    },
    {
      id: "what-if-scenarios",
      title: "What-If Scenarios",
      description: "Simulate impact of business levers on key metrics",
      icon: Calculator,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      chatPrompt:
        "Help me build what-if scenarios to simulate the impact of different business decisions on our key metrics",
    },
    {
      id: "board-deck",
      title: "Board Deck Drafting",
      description: "Generate AI-powered narratives for presentations",
      icon: FileText,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      chatPrompt: "Draft a board presentation narrative for Q3 2024 results with executive summary and key highlights",
    },
    {
      id: "peer-comparison",
      title: "Peer Benchmarking",
      description: "Compare performance against industry peers",
      icon: Users,
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      chatPrompt: "Show me how we compare to industry peers across key financial metrics",
    },
    {
      id: "profitability-analysis",
      title: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      chatPrompt: "Analyze our profitability metrics including ROE, ROA, and margin trends",
    },
    {
      id: "risk-metrics",
      title: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Target,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      chatPrompt: "What's our current risk profile and asset quality? Show me NPL ratios and provisions analysis",
    },
    {
      id: "efficiency-metrics",
      title: "Operational Efficiency",
      description: "Cost-to-income ratios and productivity metrics",
      icon: Activity,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      chatPrompt:
        "How efficient are our operations this quarter? Show me cost-to-income ratios and productivity metrics",
    },
  ]

  const quickPrompts = [
    "Why did NIM improve this quarter?",
    "What drove the increase in provisions?",
    "How do we compare to peers on ROE?",
    "Explain the variance in fee income",
    "What if loan growth was 15%?",
    "Draft board summary for Q3 results",
  ]

  const handleCardClick = (card: FeatureCard) => {
    onSendMessage(card.chatPrompt)
    onOpenChat()
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    onSendMessage(chatInput)
    onOpenChat()
    setChatInput("")
  }

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt)
    onOpenChat()
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

      {/* Feature Cards Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Start exploring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => {
            const IconComponent = card.icon
            return (
              <Card
                key={card.id}
                className={cn("cursor-pointer transition-all duration-200 hover:shadow-lg border-2 group", card.color)}
                onClick={() => handleCardClick(card)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-white/80 group-hover:bg-white transition-colors duration-200">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{card.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
