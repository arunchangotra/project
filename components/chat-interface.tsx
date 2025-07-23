"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Copy, Sparkles, ChevronUp, ChevronDown } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  citation?: string
  hasChart?: boolean
  chartData?: any
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

  // Effect to handle initial message from sidebar explore clicks
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
        hasChart: shouldIncludeChart(messageContent),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const shouldIncludeChart = (question: string): boolean => {
    const lowerQuestion = question.toLowerCase()
    return (
      lowerQuestion.includes("overview") ||
      lowerQuestion.includes("trend") ||
      lowerQuestion.includes("variance") ||
      lowerQuestion.includes("profitability")
    )
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("earnings overview") || lowerQuestion.includes("comprehensive earnings")) {
      return `## Q3 2024 Earnings Overview

**Key Performance Highlights:**
• **Net Revenue**: $2.85B (+12.3% QoQ, +18.7% YoY)
• **Net Profit**: $890M (+15.2% QoQ, +22.1% YoY)
• **Net Interest Margin**: 3.45% (+8bps QoQ)
• **Return on Equity**: 14.2% (+120bps QoQ)
• **Cost-to-Income Ratio**: 52.3% (-180bps QoQ)

**Revenue Breakdown:**
• Interest Income: $2.1B (+10.5% QoQ)
• Fee Income: $420M (-5.6% QoQ)
• Trading Income: $330M (+28.4% QoQ)

**Key Drivers:**
✅ Strong loan growth (+12% QoQ) with improved spreads
✅ Successful deposit repricing strategy
✅ Robust trading performance in volatile markets
⚠️ Regulatory impact on card interchange fees
⚠️ Higher provisions due to economic uncertainty

The quarter demonstrates strong operational performance with healthy margin expansion and controlled costs.`
    }

    if (lowerQuestion.includes("variance analysis") || lowerQuestion.includes("key variances")) {
      return `## Q3 2024 Variance Analysis

**Major Variances vs Q2 2024:**

**🔺 Positive Variances:**
• **Net Interest Income**: +$85M (+4.2%)
  - Loan repricing: +$120M
  - Volume growth: +$45M
  - Deposit mix shift: -$80M

• **Trading Revenue**: +$72M (+28.4%)
  - FX trading: +$35M
  - Fixed income: +$25M
  - Equity derivatives: +$12M

**🔻 Negative Variances:**
• **Fee Income**: -$25M (-5.6%)
  - Card interchange: -$30M (regulatory)
  - Service charges: +$5M

• **Loan Loss Provisions**: +$27M (+27.6%)
  - Commercial real estate: +$18M
  - Economic adjustments: +$7M
  - Specific provisions: +$2M

**Net Impact**: +$105M improvement in pre-provision income, partially offset by higher provisions.`
    }

    if (lowerQuestion.includes("what-if") || lowerQuestion.includes("scenarios")) {
      return `## What-If Scenario Analysis

I can help you model various scenarios. Here are some common analyses:

**📊 Available Scenarios:**
• **Loan Growth Impact**: Model 5%, 10%, 15%, or 20% growth rates
• **Interest Rate Sensitivity**: +/-50bps, +/-100bps rate changes
• **Credit Loss Scenarios**: Stress test provision requirements
• **Cost Management**: Impact of expense reduction initiatives
• **Deposit Mix Changes**: Effect of deposit composition shifts

**Example: 15% Loan Growth Scenario**
• Additional Interest Income: ~$180M annually
• Required Capital: ~$450M (assuming 10% CAR)
• ROE Impact: +150bps
• NIM Impact: +12bps (assuming current spreads)

**What specific scenario would you like me to model?**
Please specify:
- Metric to change (loan growth, rates, costs, etc.)
- Magnitude of change
- Time horizon (quarterly/annual)`
    }

    if (lowerQuestion.includes("board deck") || lowerQuestion.includes("executive summary")) {
      return `## Q3 2024 Board Deck - Executive Summary

**🎯 Key Messages:**
• Delivered strong Q3 results with 15.2% profit growth
• Successfully executed margin expansion strategy (+8bps NIM)
• Maintained disciplined risk management amid economic uncertainty

**📈 Financial Highlights:**
• Revenue growth of 12.3% QoQ driven by core banking activities
• ROE improved to 14.2%, exceeding our 13% target
• Efficiency ratio improved 180bps to 52.3%
• Book value per share increased 8.5% QoQ

**🔑 Strategic Progress:**
• Digital transformation: 78% of transactions now digital (+5pp)
• SME lending growth: 12% QoQ with maintained credit quality
• Wealth management AUM grew 15% QoQ

**⚠️ Key Risks & Mitigants:**
• Economic headwinds: Enhanced monitoring and stress testing
• Regulatory changes: Proactive compliance and fee structure adjustments
• Credit quality: Selective lending and robust provisioning

**🎯 Q4 Outlook:**
• Expect continued NIM expansion (+5-10bps)
• Loan growth target: 8-12% QoQ
• Maintain cost discipline with <53% efficiency ratio`
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("benchmark")) {
      return `## Peer Benchmarking Analysis - Q3 2024

**🏆 Performance vs Industry Peers:**

**Profitability (Ranking out of 12 peers):**
• ROE: 14.2% - **Rank #3** (Industry avg: 12.1%)
• ROA: 1.85% - **Rank #2** (Industry avg: 1.52%)
• NIM: 3.45% - **Rank #4** (Industry avg: 3.28%)

**Efficiency:**
• Cost-to-Income: 52.3% - **Rank #5** (Industry avg: 55.7%)
• Operating leverage: +340bps - **Rank #2**

**Asset Quality:**
• NPL Ratio: 1.8% - **Rank #6** (Industry avg: 2.1%)
• Provision Coverage: 68% - **Rank #4** (Industry avg: 62%)

**Capital Strength:**
• CET1 Ratio: 12.8% - **Rank #3** (Industry avg: 11.9%)
• Tier 1 Capital: 14.2% - **Rank #4**

**🎯 Key Insights:**
✅ **Outperforming**: Profitability metrics, capital strength
⚠️ **At Par**: Efficiency, asset quality
🔍 **Focus Areas**: Cost management, credit risk monitoring

**Competitive Position**: Strong fundamentals with top-quartile profitability`
    }

    if (lowerQuestion.includes("profitability") || lowerQuestion.includes("roe") || lowerQuestion.includes("roa")) {
      return `## Profitability Deep Dive - Q3 2024

**📊 Key Profitability Metrics:**

**Return on Equity (ROE): 14.2%**
• Q2 2024: 13.0% (+120bps improvement)
• YoY: 11.8% (+240bps improvement)
• Target: 13.0% ✅ **Exceeded**

**Return on Assets (ROA): 1.85%**
• Q2 2024: 1.72% (+13bps improvement)
• Industry benchmark: 1.52% ✅ **Above peer average**

**Net Interest Margin (NIM): 3.45%**
• Q2 2024: 3.37% (+8bps improvement)
• Trend: Consistent expansion over 4 quarters
• Drivers: Loan repricing (+15bps), deposit costs (+7bps)

**🔍 ROE Decomposition:**
• **Net Margin**: 31.2% (vs 29.8% in Q2)
• **Asset Turnover**: 0.059x (stable)
• **Equity Multiplier**: 7.8x (vs 7.6x in Q2)

**Profitability Drivers:**
✅ Successful yield optimization on loan portfolio
✅ Disciplined cost management (-180bps efficiency ratio)
✅ Strategic balance sheet growth
⚠️ Rising funding costs partially offset gains

**Outlook**: Expect ROE to remain above 14% with continued NIM expansion`
    }

    if (lowerQuestion.includes("risk") || lowerQuestion.includes("npl") || lowerQuestion.includes("asset quality")) {
      return `## Risk Assessment - Q3 2024

**🎯 Asset Quality Overview:**

**Non-Performing Loans (NPL):**
• NPL Ratio: 1.8% (vs 1.7% in Q2)
• Absolute NPLs: $1.2B (+$65M QoQ)
• Industry average: 2.1% ✅ **Better than peers**

**Provision Coverage:**
• Coverage Ratio: 68% (vs 65% in Q2)
• Provision Expense: $125M (+27.6% QoQ)
• Forward-looking adjustments: $7M for economic uncertainty

**📈 Credit Quality by Segment:**
• **Retail Banking**: NPL 1.2% (stable)
• **SME Lending**: NPL 1.8% (+10bps)
• **Corporate Banking**: NPL 2.4% (+20bps)
• **Commercial Real Estate**: NPL 3.1% (+40bps) ⚠️

**🔍 Key Risk Factors:**
• **Commercial Real Estate**: Increased stress from market conditions
• **Economic Sensitivity**: Higher provisions for macro uncertainty
• **Concentration Risk**: Top 20 exposures = 15% of loan book

**Risk Mitigants:**
✅ Enhanced monitoring and early warning systems
✅ Diversified portfolio across sectors and geographies
✅ Strong collateral coverage (average LTV: 65%)
✅ Robust stress testing framework

**Outlook**: Expect modest NPL increase but manageable within risk appetite`
    }

    if (
      lowerQuestion.includes("efficiency") ||
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("operational")
    ) {
      return `## Operational Efficiency Analysis - Q3 2024

**💰 Cost-to-Income Ratio: 52.3%**
• Q2 2024: 54.1% (-180bps improvement) ✅
• YoY: 56.8% (-450bps improvement) ✅
• Industry average: 55.7% ✅ **Best in class**

**📊 Cost Breakdown:**
• **Personnel Costs**: $890M (62% of total costs)
• **Technology**: $285M (20% of total costs)
• **Premises**: $145M (10% of total costs)
• **Other Operating**: $115M (8% of total costs)

**🚀 Efficiency Initiatives:**
• **Digital Transformation**: 78% digital adoption (+5pp QoQ)
  - Reduced branch transactions by 15%
  - Lower servicing costs per customer
• **Process Automation**: 45% of routine processes automated
• **Workforce Optimization**: Strategic hiring in growth areas

**📈 Productivity Metrics:**
• Revenue per FTE: $485K (+8.2% QoQ)
• Assets per FTE: $26.2M (+6.5% QoQ)
• Customer per FTE: 1,240 (+4.8% QoQ)

**🎯 Efficiency Drivers:**
✅ Technology investments delivering scale benefits
✅ Streamlined operations and process improvements
✅ Strategic cost management without compromising growth

**Q4 Outlook**: Target to maintain efficiency ratio below 53%`
    }

    if (lowerQuestion.includes("nim") || lowerQuestion.includes("margin")) {
      return "Net Interest Margin improved 8bps QoQ to 3.45% in Q3 2024. This improvement was driven by successful repricing of our loan portfolio (+15bps impact) and favorable deposit mix shift (-7bps impact from higher cost deposits). The retail lending segment contributed most significantly with SME loans repriced at higher spreads. However, competitive pressure in corporate lending limited the upside."
    }

    if (lowerQuestion.includes("sme") || lowerQuestion.includes("loan")) {
      return "SME loans performed strongly in Q3 2024, growing 12% QoQ with improved yields. New originations totaled $450M at an average spread of 275bps over benchmark, up from 250bps in Q2. Credit quality remains stable with NPL ratio at 1.8%. The segment contributed $35M incremental interest income vs Q2, representing 50% of total loan book growth."
    }

    if (lowerQuestion.includes("provision")) {
      return "Loan loss provisions increased 27.6% QoQ to $125M, primarily due to: 1) Commercial real estate exposure ($18M increase) reflecting market stress, 2) Forward-looking economic adjustments ($7M) based on updated macro scenarios, 3) Single large corporate account ($2M specific provision). Management maintains a cautious stance given economic uncertainty."
    }

    if (lowerQuestion.includes("fee") || lowerQuestion.includes("income")) {
      return "Fee income declined 5.6% QoQ to $420M, mainly due to regulatory changes affecting card interchange fees (-$30M impact). This was partially offset by higher service charges (+$5M) and increased wealth management fees (+$3M). We expect continued pressure on card fees but growth in advisory and digital banking fees going forward."
    }

    return "I can help analyze various aspects of our Q3 2024 performance. Could you be more specific about which metric or area you'd like me to focus on? I have detailed data on revenue, margins, provisions, fee income, and segment performance."
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const renderMessageContent = (message: ChatMessage) => {
    const content = message.content

    // Check if content has markdown-style formatting
    if (content.includes("##") || content.includes("**") || content.includes("•")) {
      return (
        <div className="prose prose-sm max-w-none">
          {content.split("\n").map((line, index) => {
            // Handle headers
            if (line.startsWith("## ")) {
              return (
                <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  {line.replace("## ", "")}
                </h3>
              )
            }

            // Handle bold text
            if (line.includes("**")) {
              const parts = line.split("**")
              return (
                <p key={index} className="mb-2">
                  {parts.map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="font-semibold">
                        {part}
                      </strong>
                    ) : (
                      part
                    ),
                  )}
                </p>
              )
            }

            // Handle bullet points
            if (
              line.startsWith("• ") ||
              line.startsWith("✅ ") ||
              line.startsWith("⚠️ ") ||
              line.startsWith("🔺 ") ||
              line.startsWith("🔻 ")
            ) {
              return (
                <div key={index} className="ml-4 mb-1 text-sm">
                  {line}
                </div>
              )
            }

            // Handle empty lines
            if (line.trim() === "") {
              return <br key={index} />
            }

            // Regular paragraphs
            return (
              <p key={index} className="mb-2 text-sm">
                {line}
              </p>
            )
          })}
        </div>
      )
    }

    // Regular text content
    return <div className="text-sm">{content}</div>
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
                    className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                      message.type === "user"
                        ? "bg-apple-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {renderMessageContent(message)}

                    {message.citation && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-gray-500 text-xs">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
                        >
                          {message.citation}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
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

          {/* Input field for continued conversation */}
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
