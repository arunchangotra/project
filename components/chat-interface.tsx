"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AIChatInput } from "./ai-chat-input"
import { TrendingUp, Copy, Check, MessageSquare, Lightbulb } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { quarterlyData } from "@/lib/sample-data"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  citations?: string[]
  charts?: any[]
  kpis?: any[]
  insights?: string[]
}

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Welcome to your AI Earnings Assistant! I can help you analyze financial performance, create scenarios, compare with peers, and generate board presentations. What would you like to explore today?",
      timestamp: new Date(),
      insights: [
        "Q3 2024 revenue grew 8.2% YoY to $2.85B",
        "Net profit increased 12.5% YoY to $890M",
        "NIM improved 8bps QoQ to 3.45%",
        "Cost-to-income ratio improved to 58.2%",
      ],
    },
  ])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response with comprehensive financial analysis
    setTimeout(() => {
      const aiResponse = generateAIResponse(content)
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userQuery: string): Message => {
    const query = userQuery.toLowerCase()

    if (query.includes("revenue") || query.includes("growth")) {
      return {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Revenue Analysis: Q3 2024 revenue reached $2.85B, representing an 8.2% YoY increase. This growth was primarily driven by retail deposit inflows (+12.3%) and improved lending margins in the SME segment (+15bps). The retail banking division contributed 65% of total revenue growth.",
        timestamp: new Date(),
        citations: ["Q3 2024 Earnings Report", "Segment Performance Analysis"],
        charts: [
          {
            type: "line",
            data: quarterlyData.map((q) => ({ quarter: q.quarter, revenue: q.revenue })),
            title: "Quarterly Revenue Trend",
          },
        ],
        kpis: [
          { title: "Revenue", value: "2.85B", change: 8.2, format: "currency" },
          { title: "Retail Growth", value: "12.3", change: 12.3, format: "percentage" },
        ],
      }
    }

    if (query.includes("profit") || query.includes("earnings")) {
      return {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Profitability Analysis: Net profit surged 12.5% YoY to $890M in Q3 2024, driven by strong operational performance and disciplined cost management. The improvement was supported by fee income growth (+18.2%) and effective expense control, with the cost-to-income ratio improving to 58.2%.",
        timestamp: new Date(),
        citations: ["Q3 2024 Financial Statements", "Cost Analysis Report"],
        charts: [
          {
            type: "bar",
            data: quarterlyData
              .slice(0, 4)
              .map((q) => ({ quarter: q.quarter, profit: q.netProfit, costs: q.revenue * 0.6 })),
            title: "Profit vs Costs Trend",
          },
        ],
        insights: [
          "Fee income grew 18.2% YoY, contributing $156M",
          "Operating expenses controlled at 2.1% YoY growth",
          "ROE improved to 14.8% from 13.2% last year",
        ],
      }
    }

    if (query.includes("scenario") || query.includes("forecast")) {
      return {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Scenario Analysis: Based on current trends and market conditions, I've generated three scenarios for Q4 2024. The base case assumes continued economic stability with 6-8% revenue growth. The optimistic scenario factors in accelerated digital adoption and market share gains, while the conservative scenario accounts for potential economic headwinds.",
        timestamp: new Date(),
        charts: [
          {
            type: "line",
            data: [
              { scenario: "Conservative", q4Revenue: 2.92, q4Profit: 905 },
              { scenario: "Base Case", q4Revenue: 3.05, q4Profit: 950 },
              { scenario: "Optimistic", q4Revenue: 3.18, q4Profit: 995 },
            ],
            title: "Q4 2024 Scenario Projections",
          },
        ],
        insights: [
          "Base case: 7% QoQ revenue growth expected",
          "Key risk: Commercial real estate exposure",
          "Opportunity: Digital banking adoption acceleration",
        ],
      }
    }

    if (query.includes("peer") || query.includes("compare")) {
      return {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Peer Comparison: Compared to regional banking peers, our performance is strong across key metrics. Our ROE of 14.8% ranks in the top quartile, while our cost-to-income ratio of 58.2% is competitive but has room for improvement. NIM performance is above peer median at 3.45%.",
        timestamp: new Date(),
        charts: [
          {
            type: "bar",
            data: [
              { metric: "ROE", us: 14.8, peerAvg: 12.3, topQuartile: 16.2 },
              { metric: "Cost/Income", us: 58.2, peerAvg: 61.5, topQuartile: 55.8 },
              { metric: "NIM", us: 3.45, peerAvg: 3.21, topQuartile: 3.67 },
            ],
            title: "Peer Performance Comparison",
          },
        ],
        insights: [
          "ROE outperforms peer average by 250bps",
          "Cost efficiency opportunity: 320bps to top quartile",
          "NIM above median but below top performers",
        ],
      }
    }

    if (query.includes("board") || query.includes("presentation")) {
      return {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Board Presentation: I've prepared a comprehensive board deck focusing on Q3 2024 performance highlights. Key slides include: Executive Summary with 8.2% revenue growth, Profitability Analysis showing 12.5% net profit increase, Risk Management update on commercial real estate exposure, and Strategic Initiatives progress on digital transformation.",
        timestamp: new Date(),
        insights: [
          "Executive Summary: Strong Q3 performance across all metrics",
          "Strategic Focus: Digital banking initiative showing 23% adoption",
          "Risk Management: CRE exposure reduced by 8% QoQ",
          "Outlook: Maintaining FY2024 guidance with upside potential",
        ],
      }
    }

    // Default comprehensive response
    return {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content:
        "I can help you with comprehensive financial analysis including KPI tracking, variance analysis, scenario planning, peer comparisons, and board presentation preparation. Our Q3 2024 performance shows strong momentum with 8.2% revenue growth and 12.5% profit increase. What specific area would you like to explore?",
      timestamp: new Date(),
      kpis: [
        { title: "Revenue", value: "2.85B", change: 8.2, format: "currency" },
        { title: "Net Profit", value: "890M", change: 12.5, format: "currency" },
        { title: "NIM", value: "3.45", change: 8, format: "percentage" },
        { title: "ROE", value: "14.8", change: 160, format: "percentage" },
      ],
      insights: [
        "Strong operational performance across all business lines",
        "Digital transformation initiatives gaining traction",
        "Credit quality remains stable with controlled provisions",
      ],
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const renderChart = (chart: any) => {
    if (chart.type === "line") {
      return (
        <div className="h-64 w-full">
          <h4 className="text-sm font-medium mb-2 text-gray-700">{chart.title}</h4>
          <ChartContainer
            config={{
              revenue: { label: "Revenue ($B)", color: "hsl(var(--chart-1))" },
              profit: { label: "Profit ($M)", color: "hsl(var(--chart-2))" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data}>
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )
    }

    if (chart.type === "bar") {
      return (
        <div className="h-64 w-full">
          <h4 className="text-sm font-medium mb-2 text-gray-700">{chart.title}</h4>
          <ChartContainer
            config={{
              profit: { label: "Profit ($M)", color: "hsl(var(--chart-1))" },
              costs: { label: "Costs ($M)", color: "hsl(var(--chart-2))" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data}>
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="profit" fill="var(--color-profit)" />
                <Bar dataKey="costs" fill="var(--color-costs)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )
    }

    return null
  }

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <MessageSquare className="h-5 w-5 text-apple-blue-600" />
          <span>AI Earnings Assistant</span>
          <Badge variant="secondary" className="text-xs bg-apple-blue-100 text-apple-blue-700">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] rounded-lg p-2.5 ${
                    message.type === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{message.content}</div>

                  {/* KPI Cards */}
                  {message.kpis && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {message.kpis.map((kpi: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs text-gray-600 font-medium">{kpi.title}</div>
                          <div className="text-lg font-bold text-gray-900">
                            {kpi.format === "currency"
                              ? `$${kpi.value}`
                              : kpi.format === "percentage"
                                ? `${kpi.value}%`
                                : kpi.value}
                          </div>
                          <div className="text-xs text-green-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />+{kpi.change}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Charts */}
                  {message.charts && (
                    <div className="mt-3 space-y-3">
                      {message.charts.map((chart, index) => (
                        <div key={index} className="bg-white rounded-lg p-3">
                          {renderChart(chart)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Insights */}
                  {message.insights && (
                    <div className="mt-3 bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">Key Insights</span>
                      </div>
                      <ul className="space-y-1">
                        {message.insights.map((insight, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="w-1 h-1 bg-apple-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Citations */}
                  {message.citations && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                      <div className="text-xs text-gray-500">Sources: {message.citations.join(", ")}</div>
                    </div>
                  )}

                  {/* Timestamp and Copy */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.type === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="h-5 w-5 p-0 hover:bg-gray-200"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-500" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-2 pt-1 border-t">
          <AIChatInput onSendMessage={handleSendMessage} />
        </div>
      </CardContent>
    </Card>
  )
}
