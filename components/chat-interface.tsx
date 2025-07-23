"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Copy, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData } from "@/lib/sample-data"

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

const promptSuggestions = [
  "Why did net interest margin drop?",
  "How did SME loans perform vs last quarter?",
  "What drove the increase in provisions?",
  "Compare our NIM to industry peers",
  "Explain the fee income variance",
]

// Component to render earnings overview
const EarningsOverview = () => {
  const currentQuarter = quarterlyData[0]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Q3 2024 Earnings Overview</h2>
        <p className="text-gray-600">Quarterly Financial Performance Summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">AI Summary</CardTitle>
          <CardDescription className="text-gray-600">Automated quarterly performance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p>
              <strong>Q3 2024 Performance Summary:</strong> This quarter, revenue rose by 8.2% YoY to $2.85B, driven
              primarily by retail deposit inflows and improved lending margins in the SME segment. Net profit increased
              12.5% YoY to $890M, benefiting from strong fee income growth and disciplined cost management.
            </p>
            <p className="mt-4">
              <strong>Key Highlights:</strong> Cost-to-income ratio improved to 58.2% from 59.8% in Q2, demonstrating
              operational efficiency gains. However, loan loss provisions increased 27.6% QoQ due to cautious stance on
              commercial real estate exposure. EPS grew 11.8% YoY to $4.25, exceeding analyst expectations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component to render variance analysis
const VarianceAnalysis = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Variance Analysis</h2>
      <p className="text-gray-600">Key changes and their drivers</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-2">+8.2% YoY</div>
          <p className="text-gray-700">
            Driven by strong lending activity and improved net interest margin. SME segment contributed significantly
            with 12% QoQ growth.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Provision Increase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 mb-2">+27.6% QoQ</div>
          <p className="text-gray-700">
            Proactive provisioning for commercial real estate exposure and economic uncertainty. Forward-looking
            approach to risk management.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
)

// Component to render scenario builder
const ScenarioBuilder = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What-If Scenario Builder</h2>
      <p className="text-gray-600">Simulate impact of business decisions</p>
    </div>

    <Card className="shadow-lg rounded-xl border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Scenario Inputs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Loan Growth (%)</label>
            <div className="mt-1 text-2xl font-bold text-gray-900">+15%</div>
            <p className="text-sm text-gray-600">Projected impact: +$45M revenue</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Deposit Rate Change (bps)</label>
            <div className="mt-1 text-2xl font-bold text-gray-900">+25bps</div>
            <p className="text-sm text-gray-600">Projected impact: -$12M net interest income</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Component to render board deck
const BoardDeck = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Board Presentation Draft</h2>
      <p className="text-gray-600">AI-generated executive summary</p>
    </div>

    <Card className="shadow-lg rounded-xl border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Executive Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <h3 className="text-lg font-semibold mb-3">Q3 2024 Financial Performance</h3>
          <p>
            The Bank delivered robust financial performance in Q3 2024, demonstrating resilience and strategic
            execution. Revenue surged by 8.2% YoY to $2.85 Billion, primarily fueled by strong lending activity and
            optimized net interest margin.
          </p>
          <h4 className="text-md font-semibold mt-4 mb-2">Key Highlights:</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Net Profit: $890M (+12.5% YoY)</li>
            <li>Net Interest Margin: 3.45% (+8bps QoQ)</li>
            <li>Cost-to-Income Ratio: 58.2% (improved from 59.8%)</li>
            <li>Earnings Per Share: $4.25 (+11.8% YoY)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
)

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
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)

  // Effect to handle initial message from feature cards
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

    // Simulate AI response with rich content based on the message
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

    // Check for feature card prompts and return rich content
    if (lowerQuestion.includes("earnings overview") || lowerQuestion.includes("quarterly performance snapshots")) {
      return <EarningsOverview />
    }

    if (lowerQuestion.includes("variance") && lowerQuestion.includes("analysis")) {
      return <VarianceAnalysis />
    }

    if (lowerQuestion.includes("what-if") || lowerQuestion.includes("scenario")) {
      return <ScenarioBuilder />
    }

    if (lowerQuestion.includes("board") && (lowerQuestion.includes("deck") || lowerQuestion.includes("presentation"))) {
      return <BoardDeck />
    }

    // Regular text responses for other queries
    if (lowerQuestion.includes("nim") || lowerQuestion.includes("margin")) {
      return "Net Interest Margin improved 8bps QoQ to 3.45% in Q3 2024. This improvement was driven by successful repricing of our loan portfolio (+15bps impact) and favorable deposit mix shift (-7bps impact from higher cost deposits). The retail lending segment contributed most significantly with SME loans repriced at higher spreads."
    }

    if (lowerQuestion.includes("sme") || lowerQuestion.includes("loan")) {
      return "SME loans performed strongly in Q3 2024, growing 12% QoQ with improved yields. New originations totaled $450M at an average spread of 275bps over benchmark, up from 250bps in Q2. Credit quality remains stable with NPL ratio at 1.8%."
    }

    if (lowerQuestion.includes("provision")) {
      return "Loan loss provisions increased 27.6% QoQ to $125M, primarily due to: 1) Commercial real estate exposure ($18M increase) reflecting market stress, 2) Forward-looking economic adjustments ($7M) based on updated macro scenarios, 3) Single large corporate account ($2M specific provision)."
    }

    if (lowerQuestion.includes("fee") || lowerQuestion.includes("income")) {
      return "Fee income declined 5.6% QoQ to $420M, mainly due to regulatory changes affecting card interchange fees (-$30M impact). This was partially offset by higher service charges (+$5M) and increased wealth management fees (+$3M)."
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("compare")) {
      return "Compared to industry peers, our ROE of 12.8% ranks in the top quartile, while our NIM of 3.45% is slightly above the industry average of 3.44%. Our cost-to-income ratio of 58.2% shows room for improvement compared to best-in-class peers at 56.8%."
    }

    return "I can help analyze various aspects of our Q3 2024 performance. Could you be more specific about which metric or area you'd like me to focus on? I have detailed data on revenue, margins, provisions, fee income, and segment performance."
  }

  const copyToClipboard = (content: string | React.ReactNode) => {
    if (typeof content === "string") {
      navigator.clipboard.writeText(content)
    } else {
      navigator.clipboard.writeText("Rich content - please use export function")
    }
  }

  return (
    <div className="flex flex-col h-full">
      {isMaximized && (
        <Card className="shadow-lg rounded-xl border-none mb-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center space-x-2 text-gray-800">
                <Sparkles className="h-4 w-4 text-apple-blue-600" />
                <span>Quick Questions</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">Click to ask common questions</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuickQuestions((prev) => !prev)}
              className="h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              {showQuickQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{showQuickQuestions ? "Collapse" : "Expand"} quick questions</span>
            </Button>
          </CardHeader>
          {showQuickQuestions && (
            <CardContent>
              <div className="space-y-2">
                {promptSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 text-xs rounded-lg border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent"
                    onClick={() => handleSend(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card className="shadow-lg rounded-xl border-none flex flex-col flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 space-y-4">
          <ScrollArea className="flex-1 w-full border border-gray-200 rounded-xl p-4 bg-apple-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
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
                        onClick={() => copyToClipboard(message.content)}
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

          {/* Input field for continued conversation within the chat */}
          <div className="flex space-x-2 mt-4">
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
              className="rounded-full bg-apple-blue-600 hover:bg-apple-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
