"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Clock,
  Star,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  DollarSign,
  Target,
  Activity,
  Compass,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatHistory {
  id: string
  title: string
  timestamp: string
  isStarred?: boolean
  preview: string
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
  onStartChat: (prompt: string) => void
}

interface ExploreItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  description: string
}

export function ChatSidebar({ isOpen, onToggle, onStartChat }: ChatSidebarProps) {
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Q3 NIM Analysis",
      timestamp: "2 hours ago",
      isStarred: true,
      preview: "Why did net interest margin improve this quarter?",
    },
    {
      id: "2",
      title: "Provision Variance",
      timestamp: "Yesterday",
      preview: "What drove the increase in loan loss provisions?",
    },
    {
      id: "3",
      title: "Peer Comparison",
      timestamp: "2 days ago",
      preview: "How do we compare to industry peers on ROE?",
    },
    {
      id: "4",
      title: "Board Deck Draft",
      timestamp: "3 days ago",
      isStarred: true,
      preview: "Draft executive summary for Q3 results",
    },
    {
      id: "5",
      title: "Scenario Analysis",
      timestamp: "1 week ago",
      preview: "What if loan growth was 15% next quarter?",
    },
  ])

  const exploreItems: ExploreItem[] = [
    {
      id: "earnings-overview",
      title: "Earnings Overview",
      icon: BarChart3,
      prompt:
        "Show me a comprehensive overview of our Q3 2024 earnings performance including key metrics, revenue breakdown, and year-over-year comparisons.",
      description: "Get quarterly performance snapshots and KPI summaries",
    },
    {
      id: "variance-analysis",
      title: "Variance Analysis",
      icon: TrendingUp,
      prompt:
        "Analyze the key variances in our Q3 2024 performance compared to Q2 2024 and Q3 2023. Focus on the most significant changes and their drivers.",
      description: "Drill down into specific changes with AI explanations",
    },
    {
      id: "what-if-scenarios",
      title: "What-If Scenarios",
      icon: Calculator,
      prompt:
        "Help me run what-if scenarios for Q4 2024. I want to understand the impact of different business levers on our key financial metrics.",
      description: "Simulate impact of business levers on key metrics",
    },
    {
      id: "board-deck",
      title: "Board Deck",
      icon: FileText,
      prompt:
        "Draft a comprehensive board presentation summary for Q3 2024 results, highlighting key achievements, challenges, and strategic outlook.",
      description: "Generate AI-powered narratives for presentations",
    },
    {
      id: "peer-comparison",
      title: "Peer Benchmarking",
      icon: Users,
      prompt:
        "Compare our Q3 2024 performance against industry peers. Focus on key metrics like ROE, NIM, efficiency ratios, and asset quality.",
      description: "Compare performance against industry peers",
    },
    {
      id: "profitability",
      title: "Profitability",
      icon: DollarSign,
      prompt:
        "Provide a deep dive analysis of our profitability metrics including ROE, ROA, NIM trends, and margin analysis for Q3 2024.",
      description: "Analyze ROE, ROA, and margin trends",
    },
    {
      id: "risk-metrics",
      title: "Risk Assessment",
      icon: Target,
      prompt:
        "Analyze our current risk profile including NPL ratios, provision coverage, asset quality trends, and credit risk indicators for Q3 2024.",
      description: "Review NPL ratios, provisions, and asset quality",
    },
    {
      id: "efficiency",
      title: "Efficiency",
      icon: Activity,
      prompt:
        "Evaluate our operational efficiency including cost-to-income ratios, productivity metrics, and efficiency trends compared to previous quarters.",
      description: "Cost-to-income ratios and productivity metrics",
    },
  ]

  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const handleExploreItemClick = (item: ExploreItem) => {
    onStartChat(item.prompt)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onToggle(false)
    }
  }

  const handleNewChat = () => {
    onStartChat("")
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20",
        isOpen ? "w-80" : "w-0 overflow-hidden",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleNewChat}
            className="w-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Start Exploring Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Compass className="h-4 w-4 mr-2 text-apple-blue-600" />
            Start exploring
          </div>
          <div className="grid grid-cols-2 gap-2">
            {exploreItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExploreItemClick(item)}
                  className="h-auto p-3 flex flex-col items-center justify-center text-center hover:bg-apple-gray-50 rounded-lg border border-transparent hover:border-apple-blue-200 transition-all duration-200 group"
                  title={item.description}
                >
                  <IconComponent className="h-5 w-5 text-apple-blue-600 mb-1 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-xs text-gray-700 leading-tight">{item.title}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Today Section */}
            <div className="mb-4">
              <div className="flex items-center text-xs font-medium text-gray-500 mb-2 px-2">
                <Clock className="h-3 w-3 mr-1" />
                Today
              </div>
              {chatHistory.slice(0, 2).map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-1",
                    selectedChat === chat.id ? "bg-apple-blue-50 border border-apple-blue-200" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Section */}
            <div className="mb-4">
              <div className="flex items-center text-xs font-medium text-gray-500 mb-2 px-2">Previous</div>
              {chatHistory.slice(2).map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-1",
                    selectedChat === chat.id ? "bg-apple-blue-50 border border-apple-blue-200" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{chatHistory.length} conversations</span>
            <Button variant="ghost" size="sm" className="text-xs">
              Clear all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
