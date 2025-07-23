"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Copy, BarChart3, TrendingUp, Calculator, FileText } from "lucide-react"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData } from "@/lib/sample-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string | React.ReactNode
  timestamp: Date
  citation?: string
}

interface ChatInterfaceProps {
  isMaximized: boolean
  initialMessage: string | null
}

export function ChatInterface({ isMaximized, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI Earnings Assistant. I can help you analyze Q3 2024 financial performance, explain variances, and answer questions about our banking metrics. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Effect to handle initial message from AIChatInput
  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage, true)
    }
  }, [initialMessage])

  const handleSend = async (messageContent: string, isInitial = false) => {
    if (!messageContent.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!isInitial) setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(messageContent),
        timestamp: new Date(),
        citation: "Based on Q3 2024 MIS data and variance analysis",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string | React.ReactNode => {
    const lowerQuestion = question.toLowerCase()

    // Handle specific feature requests
    if (lowerQuestion.includes("earnings overview") || lowerQuestion.includes("quarterly snapshot")) {
      return generateEarningsOverview()
    }

    if (lowerQuestion.includes("variance analysis") || lowerQuestion.includes("line item")) {
      return generateVarianceAnalysis()
    }

    if (lowerQuestion.includes("what-if") || lowerQuestion.includes("scenario")) {
      return generateScenarioBuilder()
    }

    if (lowerQuestion.includes("board deck") || lowerQuestion.includes("presentation")) {
      return generateBoardDeckContent()
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("compare")) {
      return generatePeerComparison()
    }

    // Handle specific metric questions
    if (lowerQuestion.includes("nim") || lowerQuestion.includes("margin")) {
      return "Net Interest Margin improved 8bps QoQ to 3.45% in Q3 2024. This improvement was driven by successful repricing of our loan portfolio (+15bps impact) and favorable deposit mix shift (-7bps impact from higher cost deposits). The retail lending segment contributed most significantly with SME loans repriced at higher spreads. However, competitive pressure in corporate lending limited the upside."
    }

    if (lowerQuestion.includes("provision")) {
      return "Loan loss provisions increased 27.6% QoQ to $125M, primarily due to: 1) Commercial real estate exposure ($18M increase) reflecting market stress, 2) Forward-looking economic adjustments ($7M) based on updated macro scenarios, 3) Single large corporate account ($2M specific provision). Management maintains a cautious stance given economic uncertainty."
    }

    return "I can help analyze various aspects of our Q3 2024 performance. Could you be more specific about which metric or area you'd like me to focus on? I have detailed data on revenue, margins, provisions, fee income, and segment performance."
  }

  const generateEarningsOverview = () => {
    const currentQuarter = quarterlyData[0]

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Q3 2024 Earnings Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Revenue"
            value={currentQuarter.revenue}
            change={currentQuarter.yoyRevenue}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="Net Profit"
            value={currentQuarter.netProfit}
            change={currentQuarter.yoyNetProfit}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="NIM"
            value={currentQuarter.nim}
            change={currentQuarter.yoyNim * 100}
            changeType="YoY"
            format="percentage"
          />
          <KPICard
            title="Cost-to-Income"
            value={currentQuarter.costToIncome}
            change={-1.6}
            changeType="YoY"
            format="percentage"
          />
          <KPICard title="EPS" value={currentQuarter.eps} change={currentQuarter.yoyEps} changeType="YoY" />
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Q3 2024 Performance Summary:</strong> Revenue rose by 8.2% YoY to $2.85B, driven primarily by
              retail deposit inflows and improved lending margins in the SME segment. Net profit increased 12.5% YoY to
              $890M, benefiting from strong fee income growth and disciplined cost management. Net Interest Margin
              improved 8bps QoQ to 3.45%, reflecting successful repricing of the loan portfolio amid rising rate
              environment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateVarianceAnalysis = () => {
    const varianceData = [
      { category: "Operating Income", current: 2730, previous: 2655, variance: 75 },
      { category: "Interest Income", current: 2030, previous: 1975, variance: 55 },
      { category: "Non-Interest Income", current: 700, previous: 680, variance: 20 },
      { category: "Operating Expenses", current: 1540, previous: 1492, variance: 48 },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Variance Analysis - Q3 2024</h3>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Key Variances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {varianceData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{item.category}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      ${item.current}M vs ${item.previous}M
                    </div>
                    <div className={`text-sm font-semibold ${item.variance > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.variance > 0 ? "+" : ""}${item.variance}M (
                      {((item.variance / item.previous) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">AI Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              The $75M increase in operating income was primarily driven by strong interest income growth (+$55M) from
              loan portfolio expansion and yield optimization. Non-interest income also contributed positively (+$20M)
              despite regulatory headwinds in card fees. Operating expenses increased by $48M, mainly due to strategic
              investments in technology and talent acquisition.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateScenarioBuilder = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">What-If Scenario Builder</h3>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Scenario Inputs</CardTitle>
            <CardDescription className="text-sm">Adjust key business levers to see impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Loan Growth</span>
                <span className="text-sm text-gray-600">+5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Deposit Rate Change</span>
                <span className="text-sm text-gray-600">+25bps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Fee Income Growth</span>
                <span className="text-sm text-gray-600">+3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Projected Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">$925M</div>
                <div className="text-sm text-gray-600">Net Profit</div>
                <div className="text-sm text-green-600">+$35M (+4.0%)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">3.52%</div>
                <div className="text-sm text-gray-600">NIM</div>
                <div className="text-sm text-green-600">+7bps</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateBoardDeckContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Board Presentation Draft</h3>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Q3 2024 Financial Performance Summary</strong>
              </p>
              <p>
                The Bank delivered robust financial performance in Q3 2024, demonstrating resilience and strategic
                execution. Revenue surged by 8.2% YoY to $2.85 Billion, primarily fueled by strong lending activity and
                optimized net interest margin.
              </p>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Revenue:</strong> $2.85B (+8.2% YoY) - Strong growth across core segments
                </li>
                <li>
                  <strong>Net Profit:</strong> $890M (+12.5% YoY) - Exceeding expectations
                </li>
                <li>
                  <strong>NIM:</strong> 3.45% (+8bps QoQ) - Benefiting from strategic repricing
                </li>
                <li>
                  <strong>Cost-to-Income:</strong> 58.2% - Improved operational efficiency
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generatePeerComparison = () => {
    const peerData = [
      { bank: "Our Bank", nim: 3.45, roe: 12.8, costToIncome: 58.2 },
      { bank: "Peer A", nim: 3.52, roe: 13.2, costToIncome: 56.8 },
      { bank: "Peer B", nim: 3.38, roe: 12.1, costToIncome: 61.5 },
      { bank: "Industry Avg", nim: 3.44, roe: 12.7, costToIncome: 58.9 },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Peer Comparison</h3>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Key Metrics vs Peers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                nim: { label: "NIM (%)", color: "hsl(var(--chart-1))" },
                roe: { label: "ROE (%)", color: "hsl(var(--chart-2))" },
                costToIncome: { label: "Cost-to-Income (%)", color: "hsl(var(--chart-3))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bank" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="nim" fill="var(--color-nim)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our NIM of 3.45% is slightly above industry average (3.44%) but below top performer Peer A (3.52%). Our
              ROE of 12.8% is competitive and above industry average. Cost-to-income ratio of 58.2% shows good
              operational efficiency, matching industry standards.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="shadow-lg rounded-xl border-none flex flex-col flex-1 min-h-0">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="text-base font-semibold text-gray-800">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <ScrollArea className="flex-1 w-full border border-gray-200 rounded-xl p-4 bg-apple-gray-50 min-h-0">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl p-3 shadow-sm ${
                      message.type === "user"
                        ? "bg-apple-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="text-sm">
                      {typeof message.content === "string" ? message.content : message.content}
                    </div>
                    {message.citation && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-gray-500 text-xs">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
                        >
                          {message.citation}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(typeof message.content === "string" ? message.content : "Content copied")
                        }
                        className="h-6 w-6 p-0 text-gray-500 hover:bg-apple-gray-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {/* Input field - always visible at bottom */}
          <div className="flex space-x-2 flex-shrink-0 pt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Continue the conversation..."
              onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
              disabled={isLoading}
              className="rounded-full px-4 py-2 border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500"
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
