"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { X, Plus, MessageSquare, Clock, Wrench, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, Calculator, FileText, Users, DollarSign, Target, Activity } from "lucide-react"

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const pathname = usePathname()
  const [isToolsExpanded, setIsToolsExpanded] = useState(true)

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
      title: "Board Deck",
      description: "Generate AI-powered narratives for presentations",
      icon: FileText,
      route: "/board-deck",
      isActive: true,
    },
    {
      id: "peer-benchmarking",
      title: "Peer Benchmarking",
      description: "Compare performance against industry peers",
      icon: Users,
      route: null,
      isActive: false,
    },
    {
      id: "profitability",
      title: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      route: null,
      isActive: false,
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Target,
      route: null,
      isActive: false,
    },
    {
      id: "efficiency",
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
      timestamp: "2 hours ago",
      preview: "Why did net interest margin improve...",
    },
    {
      id: "2",
      title: "Loan Loss Provisions",
      timestamp: "1 day ago",
      preview: "What drove the increase in provisions...",
    },
    {
      id: "3",
      title: "Peer ROE Comparison",
      timestamp: "2 days ago",
      preview: "How do we compare to industry peers...",
    },
  ]

  const previousChats = [
    {
      id: "4",
      title: "Q2 Board Deck Review",
      timestamp: "1 week ago",
      preview: "Generate executive summary for Q2...",
    },
    {
      id: "5",
      title: "Cost Income Analysis",
      timestamp: "2 weeks ago",
      preview: "Analyze our cost-to-income ratio...",
    },
  ]

  const handleToolClick = (tool: any) => {
    if (tool.isActive && tool.route) {
      // Navigate to the tool's route
      window.location.href = tool.route
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
          <Button variant="ghost" size="icon" onClick={() => onToggle(false)} className="h-8 w-8 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* New Chat Button */}
            <Button className="w-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            {/* Tools Section */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                className="w-full justify-start p-2 h-auto text-left hover:bg-gray-50"
              >
                <Wrench className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium text-gray-900">Tools</span>
                {isToolsExpanded ? (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Button>

              {isToolsExpanded && (
                <div className="space-y-1 ml-2">
                  <ScrollArea className="max-h-64">
                    {tools.map((tool) => {
                      const IconComponent = tool.icon
                      return (
                        <div
                          key={tool.id}
                          className={cn(
                            "group cursor-pointer rounded-lg p-2 transition-colors",
                            tool.isActive ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed",
                          )}
                          onClick={() => handleToolClick(tool)}
                        >
                          <div className="flex items-start space-x-2">
                            <div
                              className={cn(
                                "p-1.5 rounded-md flex-shrink-0",
                                tool.isActive ? "bg-apple-blue-50 text-apple-blue-600" : "bg-gray-100 text-gray-400",
                              )}
                            >
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    tool.isActive ? "text-gray-900" : "text-gray-400",
                                  )}
                                >
                                  {tool.title}
                                </p>
                                {!tool.isActive && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1 py-0 h-4 bg-gray-50 text-gray-500 border-gray-300"
                                  >
                                    Coming soon
                                  </Badge>
                                )}
                              </div>
                              <p
                                className={cn(
                                  "text-xs leading-tight line-clamp-2 mt-0.5",
                                  tool.isActive ? "text-gray-600" : "text-gray-400",
                                )}
                              >
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Recent Chats */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Recent</span>
              </div>
              <div className="space-y-1">
                {recentChats.map((chat) => (
                  <div key={chat.id} className="group cursor-pointer rounded-lg p-2 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                        <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Chats */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Previous</span>
              </div>
              <div className="space-y-1">
                {previousChats.map((chat) => (
                  <div key={chat.id} className="group cursor-pointer rounded-lg p-2 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                        <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
