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
  isStreaming?: boolean
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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
• Deposit competition may intensify

**Risk Considerations:**
• Economic slowdown could impact loan demand
• Regulatory changes may affect pricing flexibility
• Competition for deposits increasing funding costs

**Strategic Recommendations:**
• Continue aggressive loan repricing initiatives
• Focus on relationship-based deposit gathering
• Monitor competitor pricing strategies closely
• Prepare for potential margin compression in 2025`
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
• Personal loans: $1.4M provisions (3.2% of portfolio)

**Sector Analysis:**
• **Retail/Hospitality:** 3.8% provision rate (highest risk)
• **Manufacturing:** 1.9% provision rate (moderate risk)
• **Professional Services:** 0.8% provision rate (lowest risk)
• **Real Estate:** 2.4% provision rate (elevated due to market conditions)

**Forward-Looking Indicators:**
• Economic stress testing shows potential 15-20% increase in Q4
• Early warning indicators suggest continued pressure in SME segment
• Regulatory guidance emphasizes conservative provisioning approach`
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
• Regulatory capital ratios remain above minimums

**Risk Factors:**
• Credit quality deterioration could increase provisions
• Funding competition may raise deposit costs
• Regulatory capital requirements may constrain growth
• Economic downturn could reduce loan demand

**Sensitivity Analysis:**
• **Best Case:** +$7.2M pre-tax profit (assuming lower funding costs)
• **Worst Case:** +$2.1M pre-tax profit (assuming higher provisions)
• **Break-even:** Growth rate of 8.5% maintains current profitability levels`
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
• Deposit Growth: 5.4% YoY (Peer avg: 4.9%)

**Efficiency Analysis:**
• **Strengths:** Superior cost management, higher NIM
• **Areas for Improvement:** Digital adoption, fee income diversification
• **Competitive Position:** Strong fundamentals, well-positioned for growth

**Market Position:**
• Market share: 12.3% (3rd largest in region)
• Branch network: 45 locations (peer avg: 38)
• Digital adoption: 78% (peer avg: 71%)

**Strategic Implications:**
• Maintain cost discipline advantage
• Leverage strong capital position for growth
• Focus on digital transformation initiatives
• Consider strategic acquisitions to gain scale`
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

**Market Environment:**
• Interest rate environment remains supportive
• Economic indicators show mixed signals
• Competitive landscape intensifying

**Outlook:**
• Cautiously optimistic for Q4
• Continued NIM expansion expected
• Monitoring economic headwinds

**Key Priorities:**
• Maintain asset quality standards
• Execute digital transformation roadmap
• Optimize capital allocation
• Strengthen competitive positioning

**Regulatory Updates:**
• All regulatory requirements met
• Capital ratios well above minimums
• Stress test results favorable`
    }

    // Default response
    return `Thank you for your question about "${userMessage}". 

I'm here to help with financial analysis and earnings insights. I can assist with:

• **Variance Analysis** - Understanding changes in financial metrics
• **Scenario Planning** - "What if" analysis for business decisions  
• **Peer Comparisons** - Benchmarking against industry standards
• **Board Reporting** - Executive summaries and presentations
• **Risk Assessment** - Credit quality and provision analysis

Please feel free to ask about specific financial metrics, ratios, or analysis you'd like me to help with. I have access to Q3 2024 financial data and can provide detailed insights.

**Popular Questions:**
• Why did NIM improve this quarter?
• What drove the increase in provisions?
• How do we compare to peers on ROE?
• What would 15% loan growth mean for profitability?
• Can you generate an executive summary for the board?

I'm ready to dive deep into any financial topic you'd like to explore!`
  }

  // Enhanced scroll to bottom function that also ensures input visibility
  const scrollToBottomAndShowInput = () => {
    // First scroll the messages to bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }

    // Then ensure input area is visible
    setTimeout(() => {
      if (inputAreaRef.current && chatContainerRef.current) {
        const inputRect = inputAreaRef.current.getBoundingClientRect()
        const containerRect = chatContainerRef.current.getBoundingClientRect()

        // Check if input is not fully visible
        if (inputRect.bottom > containerRect.bottom || inputRect.top < containerRect.top) {
          inputAreaRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          })
        }
      }
    }, 300)
  }

  // Alternative scroll function for during streaming
  const scrollDuringStreaming = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        // Smooth scroll to bottom
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }

  // Handle initial message
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  // Auto-scroll when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottomAndShowInput()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Simulate streaming response with enhanced scrolling
  const simulateStreamingResponse = (fullResponse: string, messageId: string) => {
    const words = fullResponse.split(" ")
    let currentIndex = 0
    const streamingInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const partialResponse = words.slice(0, currentIndex + 1).join(" ")
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, content: partialResponse, isStreaming: true } : msg)),
        )
        currentIndex++

        // Auto-scroll during streaming - use lighter scroll method
        if (currentIndex % 5 === 0) {
          // Scroll every 5 words to reduce frequency
          setTimeout(scrollDuringStreaming, 50)
        }
      } else {
        // Streaming complete
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: fullResponse,
                  isStreaming: false,
                  citations: ["Q3 2024 Financial Statements", "Internal Risk Reports", "Peer Analysis Database"],
                }
              : msg,
          ),
        )
        setIsLoading(false)
        clearInterval(streamingInterval)

        // Final scroll to ensure input is visible
        setTimeout(scrollToBottomAndShowInput, 200)
      }
    }, 50) // Adjust speed as needed
  }

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

    // Scroll to bottom after user message and ensure input stays visible
    setTimeout(scrollToBottomAndShowInput, 100)

    // Create AI response placeholder
    const aiMessageId = (Date.now() + 1).toString()
    const aiResponse: Message = {
      id: aiMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    }

    // Add empty AI message
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse])

      // Start streaming after a short delay
      setTimeout(() => {
        const fullResponse = generateStaticResponse(message)
        simulateStreamingResponse(fullResponse, aiMessageId)
      }, 500)
    }, 300)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-3 mt-4 first:mt-0">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 class="text-base font-semibold text-gray-800 mb-2 mt-3">$1</h4>')
      .replace(/^• (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div ref={chatContainerRef} className={cn("flex flex-col", isMaximized ? "h-screen" : "h-full")}>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-apple-blue-600" />
              <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
            </div>
            <div className="text-xs text-gray-500">
              {messages.length > 0 && `${Math.floor(messages.length / 2)} conversations`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Start a conversation to get financial insights and analysis.</p>
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
                      "max-w-[85%] rounded-lg p-3",
                      message.role === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-50 text-gray-900",
                    )}
                  >
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />

                    {message.isStreaming && (
                      <div className="flex items-center mt-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {message.citations && !message.isStreaming && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.citations.map((citation, index) => (
                            <span key={index} className="text-xs bg-white px-2 py-1 rounded border text-gray-700">
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && !message.isStreaming && (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyMessage(message.content)}
                            className="h-6 w-6 text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
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

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex space-x-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-apple-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-apple-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
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

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area with ref for scrolling */}
          <div ref={inputAreaRef} className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
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
    </div>
  )
}
