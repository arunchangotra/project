"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIChatInput } from "./ai-chat-input"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Building2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  citations?: string[]
}

interface ChatInterfaceProps {
  isMaximized?: boolean
  initialMessage?: string | null
}

export function ChatInterface({ isMaximized = false, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Generate static response based on user message
  const generateStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("nim") || message.includes("net interest margin")) {
      return `Based on Q3 2024 results, our Net Interest Margin improved to 3.45%, up 12 basis points from Q2. Here's the detailed analysis:

**Key Drivers:**
• **Asset Yield Improvement**: +18 bps driven by repricing of floating rate loans
• **Funding Cost Optimization**: -6 bps through deposit mix shift toward current accounts
• **SME Portfolio Growth**: Higher-yielding SME loans now represent 34% of total book

**Quarterly Trend Analysis:**
• Q1 2024: 3.21%
• Q2 2024: 3.33% 
• Q3 2024: 3.45%

**Forward Outlook:**
Expected to reach 3.55-3.60% by Q4 2024, supported by continued rate environment and portfolio optimization.

*Source: Internal Financial Reporting, Q3 2024*`
    }

    if (message.includes("provision") || message.includes("loan loss")) {
      return `Loan Loss Provisions increased to ₹45.2 crores in Q3 2024, up from ₹38.7 crores in Q2. Here's the breakdown:

**Provision Analysis:**
• **Specific Provisions**: ₹28.4 crores (up 15% QoQ)
• **General Provisions**: ₹16.8 crores (up 12% QoQ)
• **Coverage Ratio**: 68.5% (industry benchmark: 65%)

**Key Factors:**
• Proactive provisioning for 2 large corporate accounts (₹8.5 crores)
• Seasonal uptick in retail delinquencies post-monsoon
• Regulatory buffer enhancement ahead of Basel III norms

**Asset Quality Metrics:**
• Gross NPL: 1.8% (down from 2.1% in Q2)
• Net NPL: 0.6% (stable)
• Recovery Rate: 42% (up from 38% in Q2)

*Source: Credit Risk Management, Q3 2024*`
    }

    if (message.includes("scenario") || message.includes("what if")) {
      return `**Scenario Analysis: 15% Loan Growth Impact**

Here's the projected impact of accelerating loan growth to 15% next quarter:

**Base Case vs. Growth Scenario:**

| Metric | Current (8.5%) | Growth Scenario (15%) | Impact |
|--------|----------------|----------------------|---------|
| Loan Book | ₹12,450 cr | ₹13,518 cr | +₹1,068 cr |
| NII | ₹245.6 cr | ₹267.8 cr | +₹22.2 cr |
| ROA | 1.42% | 1.51% | +9 bps |
| ROE | 14.2% | 15.1% | +90 bps |

**Key Assumptions:**
• Maintain current NIM of 3.45%
• Credit costs remain at 0.35% of advances
• Operating leverage drives 65% incremental margin flow-through

**Risk Considerations:**
• Higher growth may pressure asset quality
• Funding costs could increase by 5-8 bps
• Capital adequacy would drop to 16.2% (still above regulatory minimum)

*Model: Strategic Planning Framework v2.1*`
    }

    if (message.includes("peer") || message.includes("compare") || message.includes("industry")) {
      return `**Peer Comparison Analysis - ROE Performance**

Our ROE of 14.2% positions us favorably against industry peers:

**ROE Benchmarking (Q3 2024):**
• **Our Bank**: 14.2% ⭐
• **Peer Average**: 12.8%
• **Top Quartile**: 15.1%
• **Industry Median**: 11.9%

**Detailed Peer Analysis:**
• HDFC Bank: 15.8% (premium valuation)
• ICICI Bank: 14.9% (similar profile)
• Axis Bank: 13.2% (recovery phase)
• Kotak Mahindra: 12.1% (conservative approach)

**ROE Decomposition:**
• **Net Margin**: 3.45% vs. peer avg 3.21% ✓
• **Asset Turnover**: 4.1x vs. peer avg 4.0x ✓
• **Equity Multiplier**: 10.2x vs. peer avg 10.5x

**Competitive Positioning:**
Rank #3 out of 12 comparable private banks. Strong fundamentals with room for optimization in capital efficiency.

*Source: Bloomberg, Company Filings, Q3 2024*`
    }

    if (message.includes("executive") || message.includes("summary") || message.includes("q3")) {
      return `**Executive Summary - Q3 2024 Performance**

**Financial Highlights:**
• **Net Profit**: ₹89.4 crores (+18% YoY, +12% QoQ)
• **ROE**: 14.2% (up 90 bps from Q2)
• **ROA**: 1.42% (industry-leading performance)
• **Book Value**: ₹245 per share (+8% QoQ)

**Operational Excellence:**
• **NIM Expansion**: 3.45% (+12 bps QoQ) driven by yield optimization
• **Cost Efficiency**: CIR improved to 52.3% (-180 bps QoQ)
• **Credit Quality**: GNPL at 1.8% (-30 bps QoQ), best in 3 years

**Growth Momentum:**
• **Loan Growth**: 8.5% QoQ (annualized 34%)
• **Deposit Growth**: 6.2% QoQ with CASA at 42%
• **Fee Income**: ₹89.3 crores (+15% YoY)

**Strategic Progress:**
• Digital transformation: 78% transactions now digital
• SME focus: Portfolio up 24% YoY, contributing 34% of loan book
• ESG initiatives: Green financing book at ₹1,200 crores

**Outlook:**
Well-positioned for sustained growth with strong fundamentals and improving operating leverage.

*Prepared by: AI Earnings Assistant | Date: Q3 2024*`
    }

    // Default response
    return `Thank you for your question about "${userMessage}". 

I'm analyzing the latest financial data and market trends to provide you with comprehensive insights. Here are some key points I can share:

**Current Financial Position:**
• Strong balance sheet fundamentals with improving profitability metrics
• Healthy capital adequacy ratios above regulatory requirements
• Diversified revenue streams with growing fee income contribution

**Market Context:**
• Operating in a favorable interest rate environment
• Competitive positioning remains strong across key segments
• Digital transformation initiatives showing positive ROI

**Key Recommendations:**
• Continue focus on high-quality asset growth
• Maintain disciplined approach to risk management
• Leverage technology for operational efficiency gains

Would you like me to dive deeper into any specific aspect of our financial performance or provide more detailed analysis on particular metrics?

*Source: Internal Management Reports, Q3 2024*`
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateStaticResponse(content),
        sender: "assistant",
        timestamp: new Date(),
        citations: ["Internal Financial Reporting", "Risk Management Dashboard", "Strategic Planning Framework"],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-1 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-apple-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Online</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] rounded-lg p-2.5 ${
                    message.sender === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                  {message.citations && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200 text-xs text-gray-600">
                      <strong>Sources:</strong> {message.citations.join(", ")}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>

                    {message.sender === "assistant" && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-5 w-5 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-700">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-700">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-2.5 max-w-[92%]">
                  <div className="flex items-center space-x-2">
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
                    <span className="text-sm text-gray-600">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-gray-100 pt-1">
          <AIChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask about financial metrics, run scenarios, or request analysis..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
