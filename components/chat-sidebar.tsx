"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Shield,
  Activity,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [isToolsExpanded, setIsToolsExpanded] = useState(true)
  const router = useRouter()

  const tools = [
    {
      id: "earnings-overview",
      name: "Earnings Overview",
      description: "Get quarterly performance snapshots and KPI summaries",
      icon: BarChart3,
      route: "/dashboard",
      active: true,
    },
    {
      id: "variance-analysis",
      name: "Variance Analysis",
      description: "Drill down into specific changes with AI explanations",
      icon: TrendingUp,
      route: "/variance",
      active: true,
    },
    {
      id: "what-if-scenarios",
      name: "What-If Scenarios",
      description: "Simulate impact of business levers on key metrics",
      icon: Calculator,
      route: "/scenarios",
      active: true,
    },
    {
      id: "board-deck",
      name: "Board Deck Drafting",
      description: "Generate AI-powered narratives for presentations",
      icon: FileText,
      route: "/board-deck",
      active: true,
    },
    {
      id: "peer-benchmarking",
      name: "Peer Benchmarking",
      description: "Compare performance against industry peers",
      icon: Users,
      active: false,
    },
    {
      id: "profitability",
      name: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      active: false,
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Shield,
      active: false,
    },
    {
      id: "efficiency",
      name: "Operational Efficiency",
      description: "Cost-to-income ratios and productivity metrics",
      icon: Activity,
      active: false,
    },
  ]

  const recentChats = [
    "Q3 NIM analysis deep dive",
    "SME loan portfolio review",
    "Cost optimization scenarios",
    "Peer comparison - ROE trends",
  ]

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.active && tool.route) {
      router.push(tool.route)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-xl border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-73px)]">
          <div className="p-4 space-y-6">
            {/* New Chat */}
            <Button className="w-full justify-start bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            {/* Tools Section */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                className="w-full justify-start p-2 h-auto text-sm font-medium text-gray-700"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Tools
                {isToolsExpanded ? (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Button>

              {isToolsExpanded && (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {tools.map((tool) => {
                    const IconComponent = tool.icon
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className={`
                          p-2 rounded-lg border transition-all duration-200 text-left
                          ${
                            tool.active
                              ? "border-gray-200 hover:border-apple-blue-300 hover:bg-apple-blue-50 cursor-pointer"
                              : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                          }
                        `}
                      >
                        <div className="flex items-start space-x-2">
                          <IconComponent
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              tool.active ? "text-apple-blue-600" : "text-gray-400"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-sm font-medium truncate ${
                                  tool.active ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                {tool.name}
                              </h4>
                              {!tool.active && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                                  Coming soon
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-1 line-clamp-2 ${tool.active ? "text-gray-600" : "text-gray-400"}`}
                            >
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent Chats */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 px-2">Recent</h3>
              <div className="space-y-1">
                {recentChats.map((chat, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start p-2 h-auto text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <span className="truncate">{chat}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Previous Chats */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 px-2">Previous 7 days</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <span className="truncate">Board presentation prep</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <span className="truncate">Regulatory capital analysis</span>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
