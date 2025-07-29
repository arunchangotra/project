"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AIChatInput } from "@/components/ai-chat-input"
import { ChatInterface } from "@/components/chat-interface"
import { ChatSidebar } from "@/components/chat-sidebar"
import { Navigation } from "@/components/navigation"
import { Brain, MessageSquare, TrendingUp, Calculator, FileText } from "lucide-react"

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const quickPrompts = [
    {
      id: "nim-analysis",
      text: "Why did net interest margin improve this quarter?",
      icon: TrendingUp,
    },
    {
      id: "provision-variance",
      text: "What drove the increase in loan loss provisions?",
      icon: Calculator,
    },
    {
      id: "peer-comparison",
      text: "How do we compare to industry peers on ROE?",
      icon: MessageSquare,
    },
    {
      id: "board-summary",
      text: "Draft executive summary for Q3 results",
      icon: FileText,
    },
  ]

  const handlePromptClick = (prompt: string) => {
    setShowChat(true)
    // Here you would typically send the prompt to the chat
  }

  const handleChatSubmit = (message: string) => {
    setShowChat(true)
    // Handle the chat message
  }

  const handleOpenChat = () => {
    setShowChat(true)
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onToggleSidebar={setIsSidebarOpen} />
        <ChatSidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-0"}`}>
          <ChatInterface />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onToggleSidebar={setIsSidebarOpen} />
      <ChatSidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-0"}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Main Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-apple-blue-100 p-4 rounded-2xl">
                <Brain className="h-12 w-12 text-apple-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">What can I help with?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI-powered earnings assistant for financial analysis, variance insights, and strategic planning.
            </p>
          </div>

          {/* Chat Input */}
          <div className="mb-12">
            <AIChatInput onSendInitialMessage={handleChatSubmit} onOpenChat={handleOpenChat} />
          </div>

          {/* Quick Prompts */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Or try these popular questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickPrompts.map((prompt) => {
                const IconComponent = prompt.icon
                return (
                  <Card
                    key={prompt.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-apple-blue-200 group"
                    onClick={() => handlePromptClick(prompt.text)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-apple-blue-50 p-3 rounded-lg group-hover:bg-apple-blue-100 transition-colors">
                          <IconComponent className="h-6 w-6 text-apple-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium leading-relaxed">{prompt.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Activity Hint */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Start a conversation to see your recent activity and saved analyses</p>
          </div>
        </div>
      </div>
    </div>
  )
}
