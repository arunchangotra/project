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
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
}

interface ExploreItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  route?: string
  action?: () => void
  isActive: boolean
  description?: string
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const router = useRouter()

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
      route: "/dashboard",
      isActive: true,
      description: "Get quarterly performance snapshots and KPI summaries",
    },
    {
      id: "variance-analysis",
      title: "Variance Analysis",
      icon: TrendingUp,
      route: "/variance",
      isActive: true,
      description: "Drill down into specific changes with AI explanations",
    },
    {
      id: "what-if-scenarios",
      title: "What-If Scenarios",
      icon: Calculator,
      route: "/scenarios",
      isActive: true,
      description: "Simulate impact of business levers on key metrics",
    },
    {
      id: "board-deck",
      title: "Board Deck",
      icon: FileText,
      route: "/board-deck",
      isActive: true,
      description: "Generate AI-powered narratives for presentations",
    },
    {
      id: "peer-comparison",
      title: "Peer Benchmarking",
      icon: Users,
      isActive: false,
      description: "Compare performance against industry peers",
      action: () => {
        /* Handle peer comparison */
      },
    },
    {
      id: "profitability",
      title: "Profitability Deep Dive",
      icon: DollarSign,
      isActive: false,
      description: "Analyze ROE, ROA, and margin trends",
      action: () => {
        /* Handle profitability analysis */
      },
    },
    {
      id: "risk-metrics",
      title: "Risk Assessment",
      icon: Target,
      isActive: false,
      description: "Review NPL ratios, provisions, and asset quality",
      action: () => {
        /* Handle risk assessment */
      },
    },
    {
      id: "efficiency",
      title: "Operational Efficiency",
      icon: Activity,
      isActive: false,
      description: "Cost-to-income ratios and productivity metrics",
      action: () => {
        /* Handle efficiency metrics */
      },
    },
  ]

  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const handleExploreItemClick = (item: ExploreItem) => {
    if (!item.isActive) return

    if (item.route) {
      router.push(item.route)
    } else if (item.action) {
      item.action()
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20 overflow-hidden",
        isOpen ? "w-80" : "w-0",
      )}
    >
      <div className="flex flex-col h-full w-80">
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 text-sm">Menu</h2>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-100">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button className="w-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white rounded-lg text-sm h-8">
            <Plus className="h-3.5 w-3.5 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Tools Section */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
            <Wrench className="h-3.5 w-3.5 mr-2 text-apple-blue-600" />
            Tools
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {exploreItems.map((item) => {
              const IconComponent = item.icon
              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded-md border transition-all duration-200 overflow-hidden",
                    item.isActive
                      ? "border-gray-200 hover:border-apple-blue-200 hover:bg-apple-blue-50 cursor-pointer"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed",
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExploreItemClick(item)}
                    disabled={!item.isActive}
                    className={cn(
                      "w-full h-auto p-2 flex items-start justify-start text-left hover:bg-transparent",
                      item.isActive ? "text-gray-900" : "text-gray-400",
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-4 w-4 mr-2 mt-0.5 flex-shrink-0",
                        item.isActive ? "text-apple-blue-600" : "text-gray-300",
                      )}
                    />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start justify-between mb-0.5">
                        <span
                          className={cn(
                            "text-xs font-medium truncate block",
                            item.isActive ? "text-gray-900" : "text-gray-400",
                          )}
                        >
                          {item.title}
                        </span>
                        {!item.isActive && (
                          <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 whitespace-nowrap">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] leading-tight line-clamp-2",
                          item.isActive ? "text-gray-600" : "text-gray-400",
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Today Section */}
            <div className="mb-3">
              <div className="flex items-center text-[10px] font-medium text-gray-500 mb-1.5 px-2">
                <Clock className="h-2.5 w-2.5 mr-1" />
                Today
              </div>
              {chatHistory.slice(0, 2).map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-start space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 mb-1",
                    selectedChat === chat.id ? "bg-apple-blue-50 border border-apple-blue-200" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <MessageSquare className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-medium text-gray-900 truncate">{chat.title}</h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.isStarred && <Star className="h-2.5 w-2.5 text-yellow-500 fill-current" />}
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <MoreHorizontal className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{chat.preview}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{chat.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Section */}
            <div className="mb-3">
              <div className="flex items-center text-[10px] font-medium text-gray-500 mb-1.5 px-2">Previous</div>
              {chatHistory.slice(2).map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-start space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 mb-1",
                    selectedChat === chat.id ? "bg-apple-blue-50 border border-apple-blue-200" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <MessageSquare className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-medium text-gray-900 truncate">{chat.title}</h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.isStarred && <Star className="h-2.5 w-2.5 text-yellow-500 fill-current" />}
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <MoreHorizontal className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{chat.preview}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{chat.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>{chatHistory.length} conversations</span>
            <Button variant="ghost" size="sm" className="text-[10px] h-6">
              Clear all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
