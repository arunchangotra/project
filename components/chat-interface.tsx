"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIChatInput } from "@/components/ai-chat-input"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  citations?: string[]
}

interface ChatInterfaceProps {
  isMaximized?: boolean
  initialMessage?: string | null
}

export function ChatInterface({ isMaximized = false, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Generate static response based on user input
  const generateStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("nim") || message.includes("net interest margin")) {
      return `## Net Interest Margin Analysis - Q3 2024

**Key Findings:**
• NIM improved by 15 basis points to 3.45% in Q3 2024
• Primary driver was repricing of loan portfolio (+20 bps impact)
• Deposit cost increases partially offset gains (-5 bps impact)

**Detailed Breakdown:**
• **Loan Yields:** Increased from 5.2% to 5.6% (+40 bps)
  - SME loans: 6.8% (+45 bps) due to base rate increases
  - Retail mortgages: 4.2% (+35 bps) from new originations
• **Funding Costs:** Rose from 1.9% to 2.15% (+25 bps)
  - Savings accounts: 1.8% (+20 bps)
  - Term deposits: 3.2% (+30 bps)

**Forward Outlook:**
• Expect additional 5-10 bps improvement in Q4
• Asset repricing momentum continues
• Deposit competition may intensify`
    }

    if (message.includes("provision") || message.includes("loan loss")) {
      return `## Loan Loss Provisions Analysis - Q3 2024

**Provision Expense:** $12.3M (+$4.1M vs Q2)

**Key Drivers:**
• **Economic Outlook:** Increased forward-looking provisions by $2.8M
• **SME Portfolio:** Higher stress in retail/hospitality sectors (+$1.8M)
• **Model Updates:** Refined probability of default parameters (+$0.9M)
• **Individual Assessments:** 3 large exposures moved to Stage 2 (+$1.2M)

**Credit Quality Metrics:**
• **NPL Ratio:** 1.8% (vs 1.4% in Q2)
• **Stage 2 Loans:** 8.2% of portfolio (vs 6.9% in Q2)
• **Coverage Ratio:** 1.2% (vs 0.9% in Q2)

**Portfolio Breakdown:**
• SME loans: $8.1M provisions (2.1% of portfolio)
• Retail mortgages: $2.8M provisions (0.4% of portfolio)
• Personal loans: $1.4M provisions (3.2% of portfolio)`
    }

    if (message.includes("scenario") || message.includes("what if")) {
      return `## Scenario Analysis: 15% Loan Growth Impact

**Base Case vs High Growth Scenario:**

**Revenue Impact:**
• Additional interest income: +$18.2M annually
• Assuming average yield of 5.8% on new loans
• Fee income increase: +$2.1M from origination fees

**Cost Impact:**
• Additional funding costs: -$11.4M (assuming 3.2% cost of funds)
• Incremental operating costs: -$1.8M (staff, systems, compliance)
• Additional provisions: -$2.2M (assuming 1.2% provision rate)

**Net Impact:**
• **Net Interest Income:** +$6.8M (+12.3%)
• **Operating Expenses:** +$1.8M (+3.2%)
• **Provision Expense:** +$2.2M (+18.9%)
• **Pre-tax Profit:** +$4.9M (+8.7%)

**Key Assumptions:**
• Loan mix: 60% SME, 40% retail
• No significant change in deposit mix
• Regulatory capital ratios remain above minimums`
    }

    if (message.includes("peer") || message.includes("compare") || message.includes("roe")) {
      return `## Peer Comparison Analysis - Q3 2024

**Return on Equity (ROE):**
• **Our Bank:** 12.8%
• **Peer Average:** 11.4%
• **Best Performer:** Regional Bank A (14.2%)
• **Ranking:** 2nd out of 8 regional banks

**Key Performance Metrics:**

**Profitability:**
• ROA: 1.15% (Peer avg: 1.02%)
• NIM: 3.45% (Peer avg: 3.28%)
• Cost-to-Income: 58.2% (Peer avg: 62.1%)

**Asset Quality:**
• NPL Ratio: 1.8% (Peer avg: 2.1%)
• Provision Rate: 1.2% (Peer avg: 1.4%)
• Coverage Ratio: 68% (Peer avg: 65%)

**Capital Strength:**
• CET1 Ratio: 12.8% (Peer avg: 11.9%)
• Tier 1 Ratio: 14.2% (Peer avg: 13.1%)

**Growth Metrics:**
• Loan Growth: 8.2% YoY (Peer avg: 6.8%)
• Deposit Growth: 5.4% YoY (Peer avg: 4.9%)`
    }

    if (message.includes("board") || message.includes("executive") || message.includes("summary")) {
      return `## Executive Summary - Q3 2024 Results

**Financial Highlights:**
• **Net Profit:** $28.4M (+15.2% YoY, +8.7% QoQ)
• **ROE:** 12.8% (vs 11.1% in Q3 2023)
• **ROA:** 1.15% (vs 1.02% in Q3 2023)

**Key Performance Drivers:**

**Revenue Growth:**
• Net Interest Income: $52.1M (+12.3% YoY)
• Fee Income: $8.7M (+6.8% YoY)
• NIM expansion: 15 bps improvement to 3.45%

**Cost Management:**
• Operating Expenses: $30.2M (+4.1% YoY)
• Cost-to-Income Ratio: 58.2% (improved from 61.4%)
• Productivity gains from digital initiatives

**Credit Quality:**
• Provision Expense: $12.3M (vs $8.2M in Q2)
• NPL Ratio: 1.8% (manageable increase)
• Proactive risk management approach

**Strategic Progress:**
• Digital banking adoption: 78% (+12 pts YoY)
• SME lending growth: 11.2% YoY
• ESG initiatives on track

**Outlook:**
• Cautiously optimistic for Q4
• Continued NIM expansion expected
• Monitoring economic headwinds`
    }

    // Default response
    return `Thank you for your question about "${userMessage}". 

I'm here to help with financial analysis and earnings insights. I can assist with:

• **Variance Analysis** - Understanding changes in financial metrics
• **Scenario Planning** - "What if" analysis for business decisions  
• **Peer Comparisons** - Benchmarking against industry standards
• **Board Reporting** - Executive summaries and presentations
• **Risk Assessment** - Credit quality and provision analysis

Please feel free to ask about specific financial metrics, ratios, or analysis you'd like me to help with. I have access to Q3 2024 financial data and can provide detailed insights.`
  }

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateStaticResponse(message),
        role: "assistant",
        timestamp: new Date(),
        citations: ["Q3 2024 Financial Statements", "Internal Risk Reports", "Peer Analysis Database"],
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
      .replace(/^• (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>")
  }

  return (
    <Card className={cn("flex flex-col", isMaximized ? "h-screen" : "h-[600px]")}>
      <CardHeader className="pb-1 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-apple-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
          </div>
          <div className="text-xs text-gray-500">{messages.length > 0 && `${messages.length} messages`}</div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation to get financial insights and analysis.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex space-x-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-apple-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-apple-blue-600" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[92%] rounded-lg p-2.5",
                    message.role === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-50 text-gray-900",
                  )}
                >
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content),
                    }}
                  />

                  {message.citations && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.citations.map((citation, index) => (
                          <span key={index} className="text-xs bg-white px-2 py-1 rounded border text-gray-700">
                            {citation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === "assistant" && (
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyMessage(message.content)}
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
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex space-x-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-apple-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-apple-blue-600" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
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

        <div className="p-2 border-t border-gray-100">
          <AIChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask about financial metrics, scenarios, or analysis..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
