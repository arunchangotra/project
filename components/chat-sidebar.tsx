"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  X,
  MessageSquare,
  Clock,
  Bookmark,
  Settings,
  HelpCircle,
  Wrench,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  DollarSign,
  Target,
  Activity,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
}

interface ToolCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  route?: string
  isActive: boolean
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toolCards: ToolCard[] = [
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
      isActive: false,
    },
    {
      id: "profitability-analysis",
      title: "Profitability Deep Dive",
      description: "Analyze ROE, ROA, and margin trends",
      icon: DollarSign,
      isActive: false,
    },
    {
      id: "risk-metrics",
      title: "Risk Assessment",
      description: "Review NPL ratios, provisions, and asset quality",
      icon: Target,
      isActive: false,
    },
    {
      id: "efficiency-metrics",
      title: "Operational Efficiency",
      description: "Cost-to-income ratios and productivity metrics",
      icon: Activity,
      isActive: false,
    },
  ]

  const handleToolClick = (tool: ToolCard) => {
    if (tool.isActive && tool.route) {
      router.push(tool.route)
      onToggle(false) // Close sidebar after navigation
    }
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={() => onToggle(false)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
        <div className="p-4 space-y-6">
          {/* Recent Conversations */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => toggleSection("recent")}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Recent</span>
              </div>
              <ArrowRight
                className={cn("h-4 w-4 transition-transform", activeSection === "recent" ? "rotate-90" : "")}
              />
            </Button>
            {activeSection === "recent" && (
              <div className="mt-2 space-y-2 pl-6">
                <p className="text-sm text-gray-500">No recent conversations</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Tools Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => toggleSection("tools")}
            >
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span className="font-medium">Tools</span>
              </div>
              <ArrowRight
                className={cn("h-4 w-4 transition-transform", activeSection === "tools" ? "rotate-90" : "")}
              />
            </Button>
            {activeSection === "tools" && (
              <div className="mt-3 space-y-2">
                {toolCards.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <Card
                      key={tool.id}
                      className={cn(
                        "transition-all duration-200 border",
                        tool.isActive
                          ? "cursor-pointer hover:shadow-md hover:border-apple-blue-200 bg-white"
                          : "cursor-not-allowed bg-gray-50 border-gray-200",
                      )}
                      onClick={() => handleToolClick(tool)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg flex-shrink-0",
                              tool.isActive ? "bg-apple-blue-50" : "bg-gray-100",
                            )}
                          >
                            <IconComponent
                              className={cn("h-4 w-4", tool.isActive ? "text-apple-blue-600" : "text-gray-400")}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4
                                className={cn("text-sm font-medium", tool.isActive ? "text-gray-900" : "text-gray-500")}
                              >
                                {tool.title}
                              </h4>
                              {!tool.isActive && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                  Coming soon
                                </span>
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs mt-1 leading-relaxed",
                                tool.isActive ? "text-gray-600" : "text-gray-400",
                              )}
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

          {/* History */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => toggleSection("history")}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">History</span>
              </div>
              <ArrowRight
                className={cn("h-4 w-4 transition-transform", activeSection === "history" ? "rotate-90" : "")}
              />
            </Button>
            {activeSection === "history" && (
              <div className="mt-2 space-y-2 pl-6">
                <p className="text-sm text-gray-500">No conversation history</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Saved */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => toggleSection("saved")}
            >
              <div className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span className="font-medium">Saved</span>
              </div>
              <ArrowRight
                className={cn("h-4 w-4 transition-transform", activeSection === "saved" ? "rotate-90" : "")}
              />
            </Button>
            {activeSection === "saved" && (
              <div className="mt-2 space-y-2 pl-6">
                <p className="text-sm text-gray-500">No saved items</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
