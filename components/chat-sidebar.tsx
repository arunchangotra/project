"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Plus,
  Wrench,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  DollarSign,
  Target,
  Activity,
  MessageSquare,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const [showTools, setShowTools] = useState(true)
  const [showRecentChats, setShowRecentChats] = useState(true)
  const router = useRouter()

  const tools = [
    {
      id: "earnings-overview",
      title: "Earnings Overview",
      description: "Get quarterly performance snapshots and KPI summaries",
      icon: BarChart3,
      route: "/dashboard",
      isActive: true,
    },
    {
      id: "variance-analysis",
      title: "Variance Analysis",
      description: "Drill down into specific changes with AI explanations",
      icon: TrendingUp,
      route: "/variance",
      isActive: true,
    },
    {
      id: "what-if-scenarios",
      title: "What-If Scenarios",
      description: "Simulate impact of business levers on key metrics",
      icon: Calculator,
      route: "/scenarios",
      isActive: true,
    },
    {
      id: "board-deck",
      title: "Board Deck Drafting",
      description: "Generate AI-powered narratives for presentations",
      icon: FileText,
      route: "/board-deck",
      isActive: true,
    },
    {
      id: "peer-comparison",
      title: "Peer Benchmarking",
      description: "Compare performance against industry peers",
      icon: Users,
      route: null,
      isActive: false,
    },
    {
      id: "profitability-analysis",
      title: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      route: null,
      isActive: false,
    },
    {
      id: "risk-metrics",
      title: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Target,
      route: null,
      isActive: false,
    },
    {
      id: "efficiency-metrics",
      title: "Operational Efficiency",
      description: "Cost-to-income ratios and productivity metrics",
      icon: Activity,
      route: null,
      isActive: false,
    },
  ]

  const recentChats = [
    {
      id: "1",
      title: "Q3 NIM Analysis",
      preview: "Why did net interest margin improve...",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      title: "Provision Variance",
      preview: "What drove the increase in provisions...",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      title: "Board Deck Draft",
      preview: "Generate executive summary for...",
      timestamp: "3 days ago",
    },
  ]

  const handleToolClick = (tool: any) => {
    if (tool.isActive && tool.route) {
      router.push(tool.route)
      onToggle(false) // Close sidebar after navigation
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggle(false)}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-4 space-y-6">
            {/* New Chat Button */}
            <Button className="w-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            {/* Tools Section */}
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => setShowTools(!showTools)}
                className="w-full justify-start p-0 h-auto text-left font-medium text-gray-900 hover:bg-transparent"
              >
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-600" />
                  <span>Tools</span>
                  {showTools ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </Button>

              {showTools && (
                <div className="space-y-2 ml-2">
                  {tools.map((tool) => {
                    const IconComponent = tool.icon
                    return (
                      <Card
                        key={tool.id}
                        className={`cursor-pointer transition-all duration-200 border ${
                          tool.isActive
                            ? "hover:shadow-sm hover:border-apple-blue-200 border-gray-200"
                            : "border-gray-100 bg-gray-50 cursor-not-allowed"
                        }`}
                        onClick={() => handleToolClick(tool)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                tool.isActive ? "bg-apple-blue-50 text-apple-blue-600" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3
                                  className={`text-sm font-medium truncate ${
                                    tool.isActive ? "text-gray-900" : "text-gray-500"
                                  }`}
                                >
                                  {tool.title}
                                </h3>
                                {!tool.isActive && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    Coming soon
                                  </Badge>
                                )}
                              </div>
                              <p
                                className={`text-xs mt-1 line-clamp-2 ${
                                  tool.isActive ? "text-gray-600" : "text-gray-400"
                                }`}
                              >
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Recent Chats Section */}
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => setShowRecentChats(!showRecentChats)}
                className="w-full justify-start p-0 h-auto text-left font-medium text-gray-900 hover:bg-transparent"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <span>Recent Chats</span>
                  {showRecentChats ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </Button>

              {showRecentChats && (
                <div className="space-y-2 ml-2">
                  {recentChats.map((chat) => (
                    <Card
                      key={chat.id}
                      className="cursor-pointer hover:shadow-sm hover:border-apple-blue-200 transition-all duration-200 border border-gray-200"
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{chat.preview}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{chat.timestamp}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
