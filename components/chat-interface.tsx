"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, ThumbsUp, ThumbsDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  isMaximized?: boolean
  onClose?: () => void
  onMinimize?: () => void
}

export function ChatInterface({ isMaximized = false, onClose, onMinimize }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Welcome to your AI Earnings Assistant! I'm here to help you analyze ADIB's financial performance and answer questions about:

**Key Areas I Can Help With:**
• **Net Interest Margin Analysis** - Q3 2024 performance and trends
• **Operating Income Breakdown** - Revenue drivers and variance analysis  
• **Cost Management** - Expense analysis and efficiency ratios
• **Asset Quality** - NPL trends and provision coverage
• **Peer Comparisons** - ADIB vs UAE banking sector
• **Regulatory Metrics** - Capital adequacy and compliance

**Sample Questions:**
• "Why did NIM improve by 15 basis points in Q3 2024?"
• "What are the key drivers behind operating income growth?"
• "How does ADIB's cost-to-income ratio compare to peers?"
• "Analyze the variance in staff costs this quarter"

Feel free to ask me anything about ADIB's financial metrics, variance analysis, or performance trends!`,
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `**Net Interest Margin Analysis - Q3 2024**

**Key Findings:**
• NIM improved by 15 basis points to 3.45% in Q3 2024
• Primary driver was repricing of loan portfolio (+20 bps impact)
• Deposit cost increases partially offset gains (-5 bps impact)

**Detailed Breakdown:**
• **Loan Yields:** Increased from 5.2% to 5.6% (+40 bps)
  - Corporate lending: +35 bps due to rate repricing
  - Retail mortgages: +45 bps from new originations
• **Funding Costs:** Rose from 1.8% to 2.1% (+30 bps)
  - Time deposits: +40 bps due to competitive pressure
  - Current accounts: Stable at 0.5%

**Outlook:** NIM expected to stabilize around 3.4-3.5% as rate cycle matures.`,
          citations: ["ADIB Q3 2024 Results", "UAE Banking Sector Report"],
        },
        {
          content: `**Operating Income Variance Analysis**

**Q3 2024 vs Q2 2024 Performance:**

**Total Operating Income: $2,847M (+2.9% QoQ)**

**Key Drivers:**
• **Net Interest Income:** +$58M
  - Loan repricing benefits: +$65M
  - Higher funding costs: -$25M
  - Volume growth impact: +$18M

• **Non-Interest Income:** +$18M
  - Islamic banking fees: +$15M
  - FX trading income: +$8M
  - Lower card interchange: -$5M

• **Fee & Commission Income:** +$6M
  - Digital banking services: +$12M
  - Trade finance fees: +$8M
  - Regulatory adjustments: -$14M

**Risk Factors:** Watch for deposit competition impact on funding costs.`,
          citations: ["ADIB Financial Statements", "Management Commentary"],
        },
        {
          content: `**ADIB vs UAE Banking Sector Comparison**

**Cost-to-Income Ratio Analysis:**

**ADIB Performance:**
• Q3 2024: 58.7% (vs 59.9% in Q2 2024)
• Improvement driven by operating leverage
• Technology investments offset by efficiency gains

**Peer Comparison:**
• **FAB:** 56.2% - Best in class efficiency
• **ENBD:** 57.9% - Strong digital transformation
• **RAKBANK:** 61.4% - Higher due to branch network
• **UAE Average:** 58.6%

**ADIB Ranking:** 2nd among major UAE banks

**Key Strengths:**
• Digital banking adoption reducing costs
• Streamlined operations post-merger
• Effective expense management

**Areas for Improvement:**
• Branch optimization opportunities
• Further automation potential`,
          citations: ["UAE Banking Sector Analysis", "Peer Financial Reports"],
        },
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatMessageContent = (content: string) => {
    // Split content into sections
    const sections = content.split("\n\n")

    return sections.map((section, index) => {
      if (section.startsWith("**") && section.endsWith("**")) {
        // Header
        return (
          <h4 key={index} className="font-semibold text-gray-900 text-xs mb-1.5">
            {section.replace(/\*\*/g, "")}
          </h4>
        )
      } else if (section.includes("•")) {
        // Bullet points
        const lines = section.split("\n")
        return (
          <div key={index} className="mb-1.5">
            {lines.map((line, lineIndex) => {
              if (line.trim().startsWith("•")) {
                return (
                  <div key={lineIndex} className="flex items-start ml-3 mb-0.5">
                    <span className="text-apple-blue-600 mr-2 text-xs leading-tight">•</span>
                    <span className="text-xs leading-tight text-gray-700">{line.replace("•", "").trim()}</span>
                  </div>
                )
              } else if (line.trim()) {
                return (
                  <p key={lineIndex} className="text-xs leading-tight text-gray-700 mb-0.5">
                    {line.trim()}
                  </p>
                )
              }
              return null
            })}
          </div>
        )
      } else {
        // Regular paragraph
        return (
          <p key={index} className="text-xs leading-tight text-gray-700 mb-1.5">
            {section}
          </p>
        )
      }
    })
  }

  return (
    <div className={cn("flex flex-col h-full", isMaximized ? "bg-white" : "")}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex space-x-2", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" && (
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-apple-blue-100 text-apple-blue-700 text-xs">
                  <Bot className="h-2.5 w-2.5" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-lg p-2",
                message.role === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-100 text-gray-900",
              )}
            >
              <div className="prose prose-xs max-w-none">
                {message.role === "assistant" ? (
                  formatMessageContent(message.content)
                ) : (
                  <p className="text-xs leading-snug">{message.content}</p>
                )}
              </div>

              {message.role === "assistant" && (
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-200">
                  <div className="flex space-x-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-gray-200"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-gray-200">
                      <ThumbsUp className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-gray-200">
                      <ThumbsDown className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-full">
                      ADIB Q3 2024
                    </Badge>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-full">
                      UAE Banking
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  <User className="h-2.5 w-2.5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-2 justify-start">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarFallback className="bg-apple-blue-100 text-apple-blue-700 text-xs">
                <Bot className="h-2.5 w-2.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-2 max-w-[85%]">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isMaximized
                ? "Ask me about ADIB's financial performance, variance analysis, or peer comparisons..."
                : "Ask about ADIB's financials..."
            }
            className="flex-1 min-h-[36px] max-h-24 resize-none text-xs rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 p-0 bg-apple-blue-600 hover:bg-apple-blue-700 disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-1.5 text-center">
          AI responses may contain inaccuracies. Please verify important information.
        </p>
      </div>
    </div>
  )
}
