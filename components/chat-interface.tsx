"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AIChatInput } from "@/components/ai-chat-input"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles } from "lucide-react"

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
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Generate static response based on user input
  const generateStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("nim") || message.includes("net interest margin")) {
      return `Based on Q3 2024 results, our net interest margin improved by 15 basis points to 3.45%, driven by:

**Key Drivers:**
• **Asset Repricing**: 65% of our loan portfolio repriced higher (+45 bps average)
• **Funding Mix Optimization**: Reduced high-cost deposits by 12%
• **SME Loan Growth**: 18% growth in higher-yielding SME loans (avg. 6.2% yield)

**Quarterly Breakdown:**
• Q2 2024: 3.30%
• Q3 2024: 3.45%
• Improvement: +15 bps

**Forward Outlook:**
Expected to maintain current levels with potential 5-10 bps improvement in Q4 as remaining portfolio reprices.`
    }

    if (message.includes("provision") || message.includes("loan loss")) {
      return `Loan loss provisions increased by $2.3M (34%) in Q3 2024 to $9.1M, primarily due to:

**Primary Drivers:**
• **Economic Overlay**: Added $1.2M for potential recession impact
• **SME Portfolio Growth**: $0.8M provision for 18% loan growth
• **Credit Migration**: 3 accounts moved to Stage 2 ($0.3M impact)

**Portfolio Health Metrics:**
• NPL Ratio: 1.2% (vs 1.0% prior quarter)
• Coverage Ratio: 145% (industry avg: 125%)
• Stage 2 Assets: $45M (+$8M QoQ)

**Management Actions:**
• Enhanced monitoring for SME exposures >$1M
• Tightened underwriting for new originations
• Increased collection efforts for early delinquencies`
    }

    if (message.includes("scenario") || message.includes("what if") || message.includes("15%")) {
      return `**Scenario Analysis: 15% Loan Growth Impact**

If we achieve 15% quarterly loan growth (vs current 8%), here's the projected impact:

**Financial Impact:**
• **Additional Revenue**: $3.2M quarterly (+$12.8M annually)
• **NIM Impact**: +8 basis points from portfolio mix improvement
• **ROE Improvement**: +120 basis points to 14.2%

**Resource Requirements:**
• **Additional Provisions**: $1.8M (assuming current loss rates)
• **Capital Impact**: Tier 1 ratio decreases by 45 bps to 12.8%
• **Funding Need**: $85M additional deposits or wholesale funding

**Risk Considerations:**
• Credit quality may deteriorate with accelerated growth
• Operational capacity constraints in underwriting
• Potential margin compression from competitive pricing

**Recommendation**: Pursue 12% growth target with enhanced risk controls.`
    }

    if (message.includes("peer") || message.includes("compare") || message.includes("roe")) {
      return `**Peer Comparison Analysis - Q3 2024**

Our performance vs regional banking peers:

**Profitability Metrics:**
• **ROE**: 13.1% (Peer avg: 11.8%) ✅ +130 bps above
• **ROA**: 1.45% (Peer avg: 1.32%) ✅ +13 bps above  
• **NIM**: 3.45% (Peer avg: 3.28%) ✅ +17 bps above

**Efficiency Metrics:**
• **Cost-to-Income**: 58.2% (Peer avg: 61.5%) ✅ 330 bps better
• **Operating Leverage**: +4.2% (Peer avg: +1.8%) ✅ Strong

**Asset Quality:**
• **NPL Ratio**: 1.2% (Peer avg: 1.4%) ✅ 20 bps better
• **Provision Rate**: 0.65% (Peer avg: 0.78%) ✅ 13 bps lower

**Growth Metrics:**
• **Loan Growth**: 8.2% (Peer avg: 5.1%) ✅ +310 bps above
• **Deposit Growth**: 6.8% (Peer avg: 3.2%) ✅ +360 bps above

**Overall Ranking**: Top quartile performance across all key metrics.`
    }

    if (message.includes("executive") || message.includes("summary") || message.includes("board")) {
      return `**Q3 2024 Executive Summary**

**Financial Highlights:**
• Net Income: $18.2M (+22% YoY, +8% QoQ)
• ROE: 13.1% (vs 12.4% prior quarter)
• EPS: $1.24 (+$0.18 YoY)

**Key Performance Drivers:**
• **Revenue Growth**: Total revenue up 15% YoY to $52.3M
• **NIM Expansion**: Improved 15 bps to 3.45% on asset repricing
• **Fee Income**: Up 28% YoY driven by treasury services growth
• **Cost Control**: Expenses up only 6% despite 18% loan growth

**Strategic Progress:**
• **SME Banking**: Loan portfolio grew 18% QoQ, now 35% of total loans
• **Digital Transformation**: 78% of transactions now digital (+12% YoY)
• **Market Share**: Gained 40 bps in regional SME lending market

**Risk Management:**
• Credit quality remains strong with NPL ratio at 1.2%
• Tier 1 capital ratio of 13.25% provides strong buffer
• Provisions increased prudently for portfolio growth

**Outlook:**
Positioned for continued strong performance with loan pipeline of $125M and improving rate environment supporting NIM expansion.`
    }

    // Default response
    return `Thank you for your question about "${userMessage}". 

I'm here to help with financial analysis, earnings insights, and strategic planning. I can assist with:

• **Financial Performance Analysis** - Revenue, profitability, and efficiency metrics
• **Variance Analysis** - Understanding changes in key financial indicators  
• **Scenario Planning** - "What if" analysis for strategic decisions
• **Peer Benchmarking** - Competitive positioning analysis
• **Risk Assessment** - Credit quality and risk metrics evaluation
• **Board Reporting** - Executive summaries and presentation materials

Please feel free to ask specific questions about earnings, financial metrics, or request analysis on particular areas of interest.`
  }

  // Handle sending messages
  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateStaticResponse(message),
        role: "assistant",
        timestamp: new Date(),
        citations: ["Q3 2024 Financial Results", "Internal Risk Reports", "Peer Analysis Database"],
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
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
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className={`flex flex-col ${isMaximized ? "h-[calc(100vh-8rem)]" : "h-[600px]"} w-full max-w-4xl mx-auto`}>
      <CardHeader className="flex-shrink-0 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-apple-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Earnings Assistant</h3>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-2 min-h-0">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Start a conversation to get financial insights and analysis.</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] rounded-lg p-2.5 ${
                    message.role === "user"
                      ? "bg-apple-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                  {message.citations && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.citations.map((citation, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {citation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === "assistant" && (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-200">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-5 w-5 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-2.5 border border-gray-200">
                  <div className="flex items-center space-x-1">
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
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 pt-1">
          <AIChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            placeholder="Ask about earnings, run scenarios, or request analysis..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
