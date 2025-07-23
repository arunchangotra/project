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
  hasCharts?: boolean
  metrics?: any[]
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

  // Effect to handle initial message from sidebar or main page
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

    // Simulate AI response with more comprehensive content
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(messageContent),
        timestamp: new Date(),
        citation: "Based on Q3 2024 MIS data and variance analysis",
        hasCharts: shouldIncludeCharts(messageContent),
        metrics: generateMetrics(messageContent),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const shouldIncludeCharts = (question: string): boolean => {
    const lowerQuestion = question.toLowerCase()
    return (
      lowerQuestion.includes("overview") ||
      lowerQuestion.includes("trend") ||
      lowerQuestion.includes("comparison") ||
      lowerQuestion.includes("performance")
    )
  }

  const generateMetrics = (question: string) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("overview") || lowerQuestion.includes("earnings")) {
      return [
        { label: "Net Revenue", value: "$2.45B", change: "+8.2%", trend: "up" },
        { label: "Net Profit", value: "$890M", change: "+12.5%", trend: "up" },
        { label: "ROE", value: "14.2%", change: "+1.1pp", trend: "up" },
        { label: "NIM", value: "3.45%", change: "+8bps", trend: "up" },
      ]
    }

    if (lowerQuestion.includes("profitability")) {
      return [
        { label: "ROE", value: "14.2%", change: "+1.1pp", trend: "up" },
        { label: "ROA", value: "1.8%", change: "+0.2pp", trend: "up" },
        { label: "NIM", value: "3.45%", change: "+8bps", trend: "up" },
        { label: "Cost/Income", value: "52.3%", change: "-1.2pp", trend: "down" },
      ]
    }

    return null
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("overview") || lowerQuestion.includes("earnings")) {
      return `## Q3 2024 Earnings Overview

**Strong Performance Across Key Metrics**

Our Q3 2024 results demonstrate robust financial performance with significant improvements across core banking metrics:

**Revenue Growth**: Net revenue increased 8.2% QoQ to $2.45B, driven by:
- Higher net interest income (+$125M) from loan portfolio repricing
- Improved fee income from wealth management services (+$15M)
- Trading revenue contribution (+$8M)

**Profitability Expansion**: Net profit grew 12.5% to $890M with:
- ROE improving to 14.2% (+110bps YoY)
- NIM expansion to 3.45% (+8bps QoQ)
- Effective cost management keeping efficiency ratio at 52.3%

**Asset Quality**: Credit metrics remain healthy:
- NPL ratio stable at 1.8%
- Provision coverage at 85%
- New loan originations of $1.2B with strong credit standards

**Key Drivers**: The strong performance was primarily driven by successful loan repricing initiatives, disciplined cost management, and favorable market conditions in our core markets.`
    }

    if (lowerQuestion.includes("variance") || lowerQuestion.includes("changes")) {
      return `## Q3 2024 Variance Analysis

**Key Performance Changes vs Q2 2024**

**Positive Variances:**
- **Net Interest Income**: +$125M (+6.8%) - Loan repricing and volume growth
- **Fee Income**: +$18M (+4.5%) - Wealth management and digital banking fees
- **Operating Efficiency**: -120bps improvement in cost-to-income ratio

**Areas of Concern:**
- **Loan Loss Provisions**: +$35M (+27.6%) - Increased CRE exposure provisions
- **Operating Expenses**: +$25M (+3.2%) - Technology investments and compliance costs

**Year-over-Year Comparison:**
- Revenue growth of 15.2% demonstrates strong business momentum
- Credit costs normalized at 45bps of loans vs 38bps in Q3 2023
- Capital ratios strengthened with CET1 at 12.8% (+80bps YoY)

**Outlook**: Management expects continued NIM expansion in Q4 with disciplined credit underwriting maintaining asset quality.`
    }

    if (lowerQuestion.includes("profitability") || lowerQuestion.includes("roe") || lowerQuestion.includes("roa")) {
      return `## Profitability Deep Dive Analysis

**Return Metrics Performance**

**ROE Analysis (14.2%, +110bps YoY)**:
- **Net Income Growth**: Primary driver with 12.5% increase
- **Equity Efficiency**: Improved capital utilization
- **Peer Comparison**: Above industry median of 12.8%

**ROA Trends (1.8%, +20bps YoY)**:
- **Asset Productivity**: Enhanced yield on earning assets
- **Balance Sheet Optimization**: Focus on high-margin products
- **Risk-Adjusted Returns**: Strong performance relative to credit costs

**NIM Expansion (3.45%, +8bps QoQ)**:
- **Asset Repricing**: +15bps from loan portfolio repricing
- **Funding Mix**: -7bps impact from deposit competition
- **Forward Guidance**: Expected to reach 3.55% by Q4 2024

**Efficiency Improvements**:
- Cost-to-income ratio at 52.3% (-120bps QoQ)
- Technology investments driving operational leverage
- Branch optimization contributing to cost savings`
    }

    if (lowerQuestion.includes("risk") || lowerQuestion.includes("npl") || lowerQuestion.includes("provisions")) {
      return `## Risk Assessment & Asset Quality

**Credit Risk Profile - Q3 2024**

**Asset Quality Metrics**:
- **NPL Ratio**: 1.8% (stable vs Q2, industry avg: 2.1%)
- **Provision Coverage**: 85% (vs 82% Q2 2024)
- **Net Charge-offs**: 0.42% of loans (vs 0.38% Q2)

**Provision Analysis**:
- **Total Provisions**: $125M (+27.6% QoQ)
- **Specific Provisions**: $45M for single large corporate account
- **General Provisions**: $80M reflecting economic outlook adjustments

**Portfolio Composition Risk**:
- **Commercial Real Estate**: 18% of portfolio, increased monitoring
- **SME Lending**: 35% of portfolio, strong performance
- **Retail Mortgages**: 28% of portfolio, low delinquency rates

**Forward-Looking Indicators**:
- Economic scenario modeling shows resilient portfolio
- Stress testing indicates adequate capital buffers
- Early warning systems identify potential problem accounts

**Management Actions**:
- Enhanced due diligence for CRE exposures
- Tightened underwriting standards for new originations
- Increased provision buffer for economic uncertainty`
    }

    if (
      lowerQuestion.includes("efficiency") ||
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("operational")
    ) {
      return `## Operational Efficiency Analysis

**Cost Management Performance**

**Efficiency Ratio**: 52.3% (-120bps QoQ improvement)
- **Industry Benchmark**: 55.8% (we're outperforming)
- **Target Range**: 50-52% by end of 2024
- **Key Drivers**: Technology automation and process optimization

**Cost Structure Analysis**:
- **Personnel Costs**: $890M (65% of total costs)
- **Technology Investments**: $180M (+8% YoY for digital transformation)
- **Premises & Equipment**: $125M (-5% from branch optimization)

**Productivity Metrics**:
- **Revenue per Employee**: $485K (+12% YoY)
- **Assets per Employee**: $28M (+8% YoY)
- **Digital Adoption**: 78% of transactions now digital (+15pp YoY)

**Efficiency Initiatives**:
- **Branch Network**: Optimized 15 locations, saving $8M annually
- **Process Automation**: 45% of routine processes now automated
- **Digital Banking**: Mobile app usage up 25%, reducing service costs

**Future Outlook**:
- Target efficiency ratio of 50% by Q4 2025
- Continued investment in AI and automation
- Focus on revenue growth while maintaining cost discipline`
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("benchmark") || lowerQuestion.includes("comparison")) {
      return `## Peer Benchmarking Analysis

**Industry Position - Q3 2024**

**Profitability Comparison**:
- **Our ROE**: 14.2% vs Industry Median: 12.8% ✅ **+140bps advantage**
- **Our ROA**: 1.8% vs Industry Median: 1.4% ✅ **+40bps advantage**
- **Our NIM**: 3.45% vs Industry Median: 3.28% ✅ **+17bps advantage**

**Efficiency Metrics**:
- **Our Cost/Income**: 52.3% vs Industry Median: 55.8% ✅ **350bps better**
- **Revenue Growth**: 8.2% vs Industry Median: 5.1% ✅ **Outperforming**

**Asset Quality**:
- **Our NPL Ratio**: 1.8% vs Industry Median: 2.1% ✅ **30bps better**
- **Provision Coverage**: 85% vs Industry Median: 78% ✅ **More conservative**

**Capital Strength**:
- **Our CET1**: 12.8% vs Regulatory Min: 10.5% ✅ **Well-capitalized**
- **Tier 1 Ratio**: 14.2% vs Industry Median: 13.1% ✅ **Above average**

**Market Position**:
- **Top Quartile** in profitability metrics
- **Second Quartile** in efficiency measures
- **Top Quartile** in asset quality indicators

**Competitive Advantages**:
- Superior loan pricing discipline
- Effective cost management
- Strong risk management framework
- Digital banking capabilities`
    }

    if (
      lowerQuestion.includes("scenario") ||
      lowerQuestion.includes("what-if") ||
      lowerQuestion.includes("simulation")
    ) {
      return `## What-If Scenario Analysis

**Scenario Planning Framework**

I can help you model various business scenarios. Here are some key levers we can analyze:

**Interest Rate Scenarios**:
- **+100bps rate increase**: NIM could expand by ~15-20bps
- **-50bps rate decrease**: NIM compression of ~8-12bps
- **Impact on**: Net interest income, deposit costs, loan demand

**Loan Growth Scenarios**:
- **15% loan growth**: Could add ~$180M in annual revenue
- **5% loan growth**: More conservative, focused on margins
- **Impact on**: Capital ratios, funding requirements, risk profile

**Credit Cost Scenarios**:
- **Economic downturn**: Provisions could increase 50-75%
- **Benign environment**: Provision normalization to 35bps
- **Impact on**: Net income, capital adequacy, dividend capacity

**Operational Scenarios**:
- **Digital transformation acceleration**: 200bps efficiency improvement
- **Branch network optimization**: $25M annual cost savings
- **Impact on**: Cost structure, customer experience, market share

**Which scenario would you like me to model in detail?** I can provide specific financial projections and sensitivity analysis for any of these areas.`
    }

    if (lowerQuestion.includes("board") || lowerQuestion.includes("deck") || lowerQuestion.includes("presentation")) {
      return `## Board Presentation - Q3 2024 Executive Summary

**STRONG Q3 PERFORMANCE WITH CONTINUED MOMENTUM**

### Key Headlines
- **Record quarterly net income** of $890M (+12.5% QoQ)
- **NIM expansion** to 3.45% (+8bps) from successful repricing
- **Efficiency ratio improvement** to 52.3% (-120bps)
- **Maintained strong asset quality** with NPL ratio at 1.8%

### Financial Highlights
- **Revenue Growth**: $2.45B (+8.2% QoQ, +15.2% YoY)
- **ROE Expansion**: 14.2% (+110bps YoY) - top quartile performance
- **Capital Strength**: CET1 ratio of 12.8% (+80bps YoY)

### Strategic Progress
- **Digital Transformation**: 78% digital adoption (+15pp YoY)
- **Market Share Growth**: Gained 25bps in core markets
- **ESG Leadership**: Achieved carbon neutral operations

### Outlook & Priorities
- **Q4 Guidance**: NIM expected to reach 3.55%
- **2024 Targets**: ROE >14%, Efficiency ratio <52%
- **Strategic Focus**: Sustainable growth, digital innovation, ESG leadership

### Risk Management
- **Proactive provisioning** for economic uncertainty
- **Enhanced CRE monitoring** given market conditions
- **Robust stress testing** confirms capital adequacy

**Recommendation**: Board approval for increased dividend payout ratio to 45% given strong capital position and earnings momentum.`
    }

    // Default responses for other questions
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
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                    {/* Metrics Display for Assistant Messages */}
                    {message.type === "assistant" && message.metrics && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {message.metrics.map((metric, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                              <span
                                className={`text-xs font-semibold ${
                                  metric.trend === "up"
                                    ? "text-green-600"
                                    : metric.trend === "down"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {metric.change}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 mt-1">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

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
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
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
