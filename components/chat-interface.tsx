"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, User, Bot, TrendingUp, TrendingDown, ExternalLink, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  citations?: { text: string; url: string }[]
  metrics?: { name: string; value: string; change: string; trend: "up" | "down" }[]
}

interface ChatInterfaceProps {
  isMaximized: boolean
  onClose?: () => void
  onMinimize?: () => void
}

export function ChatInterface({ isMaximized, onClose, onMinimize }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: `Welcome to ADIB's AI Earnings Assistant! I can help you analyze Q3 2024 financial performance with real-time data insights.

**Key Highlights:**
• **Revenue**: $2,847M (+7.8% YoY)
• **Net Profit**: $891M (+11.2% YoY) 
• **NIM**: 3.42% (-18bps YoY)
• **Cost-to-Income**: 58.7% (improved from 59.9%)

**What I can help with:**
- Variance analysis and metric explanations
- Peer benchmarking and competitive positioning
- Scenario modeling and forecasting
- Detailed line item breakdowns

Try asking: *"Why did NIM decline despite strong profit growth?"* or *"How does ADIB compare to UAE banking peers?"*`,
      timestamp: new Date(),
      metrics: [
        { name: "Revenue", value: "$2,847M", change: "+7.8%", trend: "up" },
        { name: "Net Profit", value: "$891M", change: "+11.2%", trend: "up" },
        { name: "NIM", value: "3.42%", change: "-18bps", trend: "down" },
        { name: "Cost/Income", value: "58.7%", change: "-1.2pp", trend: "up" },
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with ADIB-specific data
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(input.trim()),
        timestamp: new Date(),
        citations: [
          { text: "ADIB Q3 2024 Financial Results", url: "/variance?metricId=NIM" },
          { text: "UAE Banking Sector Analysis", url: "/scenarios" },
        ],
        metrics:
          input.toLowerCase().includes("nim") || input.toLowerCase().includes("margin")
            ? [
                { name: "NIM", value: "3.42%", change: "-18bps", trend: "down" },
                { name: "Loan Yield", value: "4.87%", change: "+25bps", trend: "up" },
                { name: "Funding Cost", value: "1.45%", change: "+43bps", trend: "down" },
              ]
            : input.toLowerCase().includes("profit") || input.toLowerCase().includes("earnings")
              ? [
                  { name: "Net Profit", value: "$891M", change: "+11.2%", trend: "up" },
                  { name: "ROE", value: "11.2%", change: "+0.8pp", trend: "up" },
                  { name: "ROA", value: "1.24%", change: "+0.1pp", trend: "up" },
                ]
              : undefined,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("nim") || lowerQuery.includes("margin")) {
      return `**Net Interest Margin Analysis - Q3 2024**

ADIB's NIM declined by 18bps YoY to 3.42%, primarily due to:

**Key Drivers:**
• **Funding Cost Pressure**: Deposit costs increased 43bps as competition for deposits intensified
• **Asset Repricing Lag**: Loan portfolio repricing (+25bps) couldn't fully offset funding cost increases
• **Mix Effect**: Higher proportion of lower-margin corporate lending

**Detailed Breakdown:**
• **Loan Yields**: Improved from 4.62% to 4.87% (+25bps)
• **Deposit Costs**: Rose from 1.02% to 1.45% (+43bps)
• **Net Spread**: Compressed from 3.60% to 3.42% (-18bps)

**Outlook**: NIM expected to stabilize as rate cycle peaks and repricing catches up.`
    }

    if (lowerQuery.includes("profit") || lowerQuery.includes("earnings")) {
      return `**Profit Performance Analysis - Q3 2024**

ADIB delivered strong profit growth of 11.2% YoY to $891M, driven by:

**Revenue Growth**: $2,847M (+7.8% YoY)
• Interest income growth from portfolio expansion
• Stable fee income from digital banking services
• Controlled funding cost management

**Cost Discipline**: Operating expenses up only 0.8%
• Staff costs managed through productivity gains
• Technology investments offset by efficiency savings
• Cost-to-income ratio improved to 58.7%

**Asset Quality**: Impairment charges increased 8.0%
• Prudent provisioning approach maintained
• Portfolio growth-related provisions
• Strong underlying asset quality metrics

**Key Ratios:**
• ROE: 11.2% (+0.8pp YoY)
• ROA: 1.24% (+0.1pp YoY)
• EPS: $4.24 (+10.9% YoY)`
    }

    if (lowerQuery.includes("peer") || lowerQuery.includes("benchmark") || lowerQuery.includes("compare")) {
      return `**ADIB Peer Comparison - Q3 2024**

**Profitability Metrics:**
• **ROE**: ADIB 11.2% vs UAE Avg 12.0% (-0.8pp)
• **ROA**: ADIB 1.24% vs UAE Avg 1.31% (-0.07pp)
• **NIM**: ADIB 3.42% vs UAE Avg 3.58% (-16bps)

**Efficiency Metrics:**
• **Cost/Income**: ADIB 58.7% vs UAE Avg 58.6% (+0.1pp)
• **Operating Leverage**: Positive 6.0% vs Sector 4.2%

**Competitive Position:**
• **Strengths**: Strong Islamic banking franchise, digital innovation
• **Opportunities**: NIM expansion potential, fee income growth
• **Market Share**: Leading position in Sharia-compliant banking

**Peer Rankings:**
1. ENBD: ROE 13.1%, NIM 3.51%
2. FAB: ROE 12.8%, NIM 3.28%
3. **ADIB: ROE 11.2%, NIM 3.42%**
4. RAKBANK: ROE 10.9%, NIM 4.12%`
    }

    return `I can help you analyze ADIB's Q3 2024 financial performance. Based on the real data from our systems:

**Quick Insights:**
• Revenue grew 7.8% YoY to $2,847M
• Net profit increased 11.2% YoY to $891M  
• NIM compressed 18bps to 3.42% due to funding cost pressures
• Cost-to-income ratio improved to 58.7%

**Available Analysis:**
• Detailed variance analysis by line item
• Peer benchmarking vs UAE banks
• Scenario modeling and forecasting
• Metric deep-dives and explanations

Try asking about specific metrics like "NIM trends", "profit drivers", or "peer comparison" for detailed insights.`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className={cn("flex flex-col h-full", isMaximized ? "max-w-4xl mx-auto" : "")}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-2", message.type === "user" ? "justify-end" : "justify-start")}
          >
            {message.type === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-apple-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-apple-blue-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-lg p-2 text-xs leading-snug",
                message.type === "user"
                  ? "bg-apple-blue-600 text-white ml-8"
                  : "bg-gray-100 text-gray-900 mr-8",
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>

              {/* Metrics Display */}
              {message.metrics && (
                <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-200">
                  {message.metrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded p-1.5 border">
                      <div className="text-xs text-gray-600 mb-0.5">{metric.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-gray-900">{metric.value}</span>
                        <div
                          className={cn(
                            "flex items-center text-xs",
                            metric.trend === "up" ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {metric.trend === "up" ? (
                            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                          ) : (
                            <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                          )}
                          <span>{metric.change}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Citations */}
              {message.citations && (
                <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                  <div className="text-xs text-gray-600 mb-1">Sources:</div>
                  {message.citations.map((citation, index) => (
                    <Link
                      key={index}
                      href={citation.url}
                      className="flex items-center text-xs text-apple-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-2.5 h-2.5 mr-1" />
                      {citation.text}
                    </Link>
                  ))}
                </div>
              )}

              {/* Message Actions */}
              {message.type === "assistant" && (
                <div className="flex items-center justify-end space-x-0.5 mt-1.5 pt-1.5 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyMessage(message.content)}
                    className="h-5 w-5 p-0 hover:bg-gray-200"
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
              )}
            </div>
            {message.type === "user" && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-apple-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-apple-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-2 mr-8">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about ADIB's Q3 2024 performance..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="sm" className="px-3">
            <Send className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-1.5 text-center">
          AI responses based on ADIB Q3 2024 financial data • Always verify important information
        </div>
      </div>
    </div>
  )
}
