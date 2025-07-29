"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AIChatInput } from "@/components/ai-chat-input"
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  citations?: Array<{
    title: string
    source: string
    url?: string
  }>
}

interface ChatInterfaceProps {
  isMaximized?: boolean
  initialMessage?: string | null
}

export function ChatInterface({ isMaximized = false, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate static response based on user input
  const generateStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("nim") || message.includes("net interest margin")) {
      return `Based on Q3 2024 results, our net interest margin improved by 15 basis points to 3.45%, driven by several key factors:

**Primary Drivers:**
• **Asset Repricing**: 65% of our loan portfolio repriced higher (+180 bps average) as rates increased
• **Deposit Mix Optimization**: Reduced high-cost time deposits by 12%, increased low-cost checking by 8%
• **SME Loan Growth**: Added $2.1B in higher-yielding SME loans at 6.8% average rate
• **Securities Portfolio**: Reinvested $800M in maturing securities at 4.2% vs. previous 2.1%

**Quarterly Breakdown:**
• Q3 NIM: 3.45% (+15 bps QoQ)
• Asset Yield: 5.82% (+22 bps)
• Cost of Funds: 2.37% (+7 bps)
• Net Spread: 3.45% (+15 bps)

The improvement reflects our proactive balance sheet management and disciplined pricing strategy in the rising rate environment.`
    }

    if (message.includes("provision") || message.includes("loan loss")) {
      return `Loan loss provisions increased by $45M to $125M in Q3 2024, representing a 56% quarter-over-quarter increase. Here's the detailed breakdown:

**Key Drivers:**
• **Economic Outlook**: Updated CECL model reflecting higher recession probability (35% vs 25%)
• **Portfolio Growth**: $2.1B in new SME loans requiring initial provisions
• **Credit Migration**: 2.3% of commercial portfolio moved to Stage 2 (increased risk)
• **Specific Reserves**: $12M for three large commercial relationships

**Provision Analysis by Segment:**
• Commercial: $78M (+$32M QoQ)
• SME: $28M (+$18M QoQ) 
• Consumer: $19M (-$5M QoQ)

**Credit Quality Metrics:**
• NPL Ratio: 0.89% (vs 0.76% prior quarter)
• Net Charge-offs: $38M (0.52% annualized)
• Coverage Ratio: 1.85% of total loans

Despite the increase, our credit metrics remain well within industry benchmarks and reflect prudent risk management.`
    }

    if (message.includes("loan growth") || message.includes("15%")) {
      return `**Scenario Analysis: 15% Quarterly Loan Growth Impact**

If we achieve 15% loan growth next quarter (vs. baseline 8%), here are the projected impacts:

**Balance Sheet Impact:**
• Additional Loans: $3.2B incremental growth
• Required Funding: $3.2B (mix: 60% deposits, 40% wholesale)
• Capital Utilization: +180 bps to CET1 ratio

**P&L Impact (Quarterly):**
• Net Interest Income: +$42M (+18% vs baseline)
• Provision Expense: +$28M (0.85% of new loans)
• Operating Expenses: +$8M (processing, underwriting)
• **Net Income Impact: +$4.2M (+3.1%)**

**Key Assumptions:**
• New loan yield: 6.9% (current market rates)
• Deposit cost increase: +25 bps (competitive pressure)
• Credit loss rate: 0.85% on new originations
• Operational leverage: 65% incremental margin

**Risk Considerations:**
• Concentration risk in SME segment
• Funding cost pressure from rapid growth
• Credit quality dilution potential
• Regulatory capital constraints

This scenario would enhance profitability while maintaining acceptable risk parameters.`
    }

    if (message.includes("peer") || message.includes("roe") || message.includes("compare")) {
      return `**Peer Comparison Analysis - Q3 2024**

Our performance relative to regional banking peers shows strong competitive positioning:

**Return on Equity (ROE):**
• Our Bank: 14.2%
• Peer Median: 12.8%
• Top Quartile: 15.1%
• **Ranking: 2nd quartile, above median**

**Key Performance Metrics vs Peers:**
• **NIM**: 3.45% vs 3.21% peer median (+24 bps advantage)
• **Efficiency Ratio**: 58.2% vs 61.4% peer median (better)
• **ROA**: 1.28% vs 1.15% peer median (+13 bps)
• **CET1 Ratio**: 12.1% vs 11.8% peer median (stronger)

**Credit Quality Comparison:**
• NPL Ratio: 0.89% vs 1.12% peer median (better)
• NCO Rate: 0.52% vs 0.68% peer median (better)
• Coverage Ratio: 1.85% vs 1.72% peer median (higher)

**Growth Metrics:**
• Loan Growth: 12.3% vs 8.7% peer median (stronger)
• Deposit Growth: 6.8% vs 4.2% peer median (stronger)
• Fee Income Growth: 4.1% vs 2.9% peer median (better)

**Competitive Advantages:**
• Superior NIM from disciplined pricing
• Strong credit underwriting culture
• Efficient operating model
• Robust capital position

We're outperforming peers across most key metrics while maintaining conservative risk management.`
    }

    if (message.includes("executive summary") || message.includes("board") || message.includes("q3 results")) {
      return `**Q3 2024 Executive Summary - Board Presentation**

**Financial Highlights:**
• **Net Income**: $142M (+8.4% QoQ, +12.1% YoY)
• **ROE**: 14.2% (vs 13.1% prior quarter)
• **ROA**: 1.28% (vs 1.19% prior quarter)
• **Book Value per Share**: $28.45 (+2.1% QoQ)

**Balance Sheet Strength:**
• **Total Assets**: $44.2B (+3.2% QoQ)
• **Loan Portfolio**: $32.1B (+4.1% QoQ, +12.3% YoY)
• **Deposits**: $36.8B (+2.8% QoQ, +6.8% YoY)
• **CET1 Ratio**: 12.1% (well above regulatory minimums)

**Operational Excellence:**
• **NIM Expansion**: 3.45% (+15 bps QoQ) - best in 18 months
• **Efficiency Ratio**: 58.2% (improved from 59.7%)
• **Fee Income**: $48M (+4.1% QoQ)
• **Cost Control**: Expenses flat despite inflation

**Credit Quality:**
• **NPL Ratio**: 0.89% (manageable increase from 0.76%)
• **Provision Expense**: $125M (normalized level)
• **Net Charge-offs**: 0.52% annualized (below peer average)

**Strategic Progress:**
• SME lending initiative: $2.1B new originations
• Digital transformation: 78% of transactions now digital
• ESG commitments: $500M in sustainable finance

**Outlook:**
Strong momentum entering Q4 with robust loan pipeline, stable funding costs, and disciplined risk management positioning us well for continued profitable growth.`
    }

    if (message.includes("cost") || message.includes("efficiency") || message.includes("income ratio")) {
      return `**Cost-to-Income Ratio Analysis - Q3 2024**

Our efficiency ratio improved to 58.2% in Q3, down from 59.7% in Q2, demonstrating strong operational leverage:

**Quarterly Trend Analysis:**
• Q3 2024: 58.2% (-150 bps QoQ)
• Q2 2024: 59.7%
• Q1 2024: 61.2%
• Q4 2023: 62.8%
• **12-month improvement: -460 bps**

**Revenue Growth Drivers:**
• Net Interest Income: +$18M (+6.2% QoQ)
• Fee Income: +$1.9M (+4.1% QoQ)
• Trading Revenue: +$0.8M
• **Total Revenue: +$20.7M (+5.8%)**

**Expense Management:**
• Personnel Costs: $198M (flat QoQ despite 3% merit increases)
• Technology: $42M (+2.1% - strategic investments)
• Occupancy: $28M (-1.8% - branch optimization)
• **Total Expenses: $312M (+0.3%)**

**Productivity Metrics:**
• Revenue per FTE: $1.24M (+5.5% QoQ)
• Assets per FTE: $18.2M (+3.1%)
• Loans per Relationship Manager: $145M (+8.2%)

**Peer Comparison:**
• Our Ratio: 58.2%
• Regional Peer Median: 61.4%
• **Advantage: -320 bps (top quartile performance)**

**Key Success Factors:**
• Process automation reducing manual work
• Branch network optimization
• Technology investments driving efficiency
• Revenue growth outpacing expense growth

Target: Maintain sub-60% efficiency ratio while investing in growth initiatives.`
    }

    // Default response for other queries
    return `Thank you for your question about "${userMessage}". 

I'm analyzing your request and can provide insights on various financial topics including:

• **Earnings Analysis**: Quarterly performance, variance explanations, and trend analysis
• **Scenario Planning**: "What-if" modeling for business decisions
• **Peer Benchmarking**: Competitive positioning and market comparisons  
• **Risk Assessment**: Credit quality, provisions, and risk metrics
• **Operational Metrics**: Efficiency ratios, productivity measures, and cost analysis

Could you please provide more specific details about what aspect you'd like me to focus on? For example:
- Specific financial metrics or ratios
- Time periods for comparison
- Particular business segments
- Regulatory or strategic considerations

This will help me provide you with more targeted and actionable insights.`
  }

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: initialMessage,
        timestamp: new Date(),
      }

      setMessages([userMessage])

      // Simulate AI response
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: generateStaticResponse(initialMessage),
            timestamp: new Date(),
            citations: [
              {
                title: "Q3 2024 Financial Results",
                source: "Internal Financial Reports",
              },
              {
                title: "Peer Analysis Database",
                source: "Market Intelligence",
              },
            ],
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsTyping(false)
        }, 2000)
      }, 500)
    }
  }, [initialMessage, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: generateStaticResponse(message),
          timestamp: new Date(),
          citations: [
            {
              title: "Q3 2024 Financial Results",
              source: "Internal Financial Reports",
            },
            {
              title: "Market Analysis",
              source: "Bloomberg Terminal",
            },
          ],
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    }, 300)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <Card className={cn("flex flex-col", isMaximized ? "h-[calc(100vh-8rem)]" : "h-[600px]")}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-apple-blue-100 rounded-lg">
              <Bot className="h-5 w-5 text-apple-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
              <p className="text-sm text-gray-500">Financial Analysis & Insights</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="p-4 bg-apple-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-apple-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to assist with your financial analysis
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ask me about earnings, variances, scenarios, or any financial questions you have.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full flex-shrink-0",
                    message.type === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-100 text-gray-600",
                  )}
                >
                  {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={cn("flex-1 max-w-[85%]", message.type === "user" ? "flex justify-end" : "")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3",
                      message.type === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-50 text-gray-900",
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                        <div className="space-y-1">
                          {message.citations.map((citation, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              <span className="font-medium">{citation.title}</span>
                              <span className="text-gray-500"> - {citation.source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.type === "assistant" && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-50 rounded-2xl px-4 py-3">
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

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-gray-100 p-4">
          <AIChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            placeholder="Ask about financial performance, scenarios, or analysis..."
            disabled={isTyping}
          />
        </div>
      </CardContent>
    </Card>
  )
}
