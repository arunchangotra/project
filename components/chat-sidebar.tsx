"use client"

import { useState } from "react"
import {
  X,
  ChevronDown,
  ChevronRight,
  Wrench,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  DollarSign,
  Shield,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const [isToolsExpanded, setIsToolsExpanded] = useState(true)

  const tools = [
    {
      id: "earnings-overview",
      title: "Earnings Overview",
      description: "Get quarterly performance snapshots and KPI summaries",
      icon: BarChart3,
      route: "/dashboard",
      active: true,
    },
    {
      id: "variance-analysis",
      title: "Variance Analysis",
      description: "Drill down into specific changes with AI explanations",
      icon: TrendingUp,
      route: "/variance",
      active: true,
    },
    {
      id: "what-if-scenarios",
      title: "What-If Scenarios",
      description: "Simulate impact of business levers on key metrics",
      icon: Calculator,
      route: "/scenarios",
      active: true,
    },
    {
      id: "board-deck",
      title: "Board Deck Drafting",
      description: "Generate AI-powered narratives for presentations",
      icon: FileText,
      route: "/board-deck",
      active: true,
    },
    {
      id: "peer-benchmarking",
      title: "Peer Benchmarking",
      description: "Compare performance against industry peers",
      icon: Users,
      active: false,
    },
    {
      id: "profitability",
      title: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      active: false,
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Shield,
      active: false,
    },
    {
      id: "efficiency",
      title: "Operational Efficiency",
      description: "Cost-to-income ratios and productivity metrics",
      icon: Activity,
      active: false,
    },
  ]

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.active && tool.route) {
      onToggle(false) // Close sidebar after navigation
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => onToggle(false)} className="h-8 w-8 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Tools Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setIsToolsExpanded(!isToolsExpanded)}
              className="w-full justify-between p-2 h-auto hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Tools</span>
              </div>
              {isToolsExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </Button>

            {isToolsExpanded && (
              <div className="mt-3 space-y-2">
                {tools.map((tool) => {
                  const IconComponent = tool.icon

                  if (tool.active && tool.route) {
                    return (
                      <Link key={tool.id} href={tool.route}>
                        <div
                          onClick={() => handleToolClick(tool)}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 group-hover:text-blue-700" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-800">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tool.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  }

                  return (
                    <div
                      key={tool.id}
                      className="flex items-start space-x-3 p-3 rounded-lg cursor-not-allowed opacity-60"
                    >
                      <IconComponent className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-500">{tool.title}</h3>
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500">
                            Coming soon
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Conversations */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="text-sm text-gray-700">Q3 variance analysis discussion</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="text-sm text-gray-700">Board deck preparation</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="text-sm text-gray-700">Risk assessment review</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Settings</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="text-sm text-gray-700">Preferences</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="text-sm text-gray-700">Help & Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
