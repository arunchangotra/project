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

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    // Enhanced responses for explore items
    if (lowerQuestion.includes("comprehensive overview") || lowerQuestion.includes("earnings performance")) {
      return `## Q3 2024 Earnings Overview

**Key Financial Highlights:**
• Net Revenue: $2.85B (+8.2% YoY, +3.1% QoQ)
• Net Profit: $485M (+12.5% YoY, +5.8% QoQ)
• Net Interest Margin: 3.45% (+8bps QoQ)
• Return on Equity: 14.2% (+120bps YoY)
• Cost-to-Income Ratio: 52.3% (-180bps YoY)

**Performance Drivers:**
✅ Strong loan growth (+12% QoQ) led by SME segment
✅ Successful loan repricing improved NIM
✅ Controlled operating expenses despite inflation
✅ Stable credit quality with NPL ratio at 1.8%

**Areas of Focus:**
⚠️ Fee income declined 5.6% due to regulatory changes
⚠️ Provision expenses increased 27.6% QoQ
⚠️ Competitive pressure in corporate lending

Overall, Q3 2024 demonstrates strong operational performance with healthy profitability metrics and controlled risk profile.`
    }

    if (lowerQuestion.includes("variance analysis") || lowerQuestion.includes("main drivers")) {
      return `## Q3 2024 Variance Analysis

**Revenue Variances (vs Q2 2024):**
• Net Interest Income: +$85M (+6.2%)
  - Loan repricing: +$95M
  - Volume growth: +$45M
  - Deposit cost increase: -$55M

• Fee Income: -$25M (-5.6%)
  - Card interchange fees: -$30M (regulatory impact)
  - Service charges: +$5M

**Expense Variances:**
• Operating Expenses: +$15M (+2.1%)
  - Staff costs: +$8M (annual increments)
  - Technology investments: +$12M
  - Efficiency gains: -$5M

• Provisions: +$27M (+27.6%)
  - Commercial real estate: +$18M
  - Economic adjustments: +$7M
  - Specific provisions: +$2M

**Net Impact:** +$43M improvement in net profit QoQ`
    }

    if (lowerQuestion.includes("what-if scenarios") || lowerQuestion.includes("loan growth")) {
      return `## What-If Scenario Analysis

**Scenario 1: 15% Loan Growth in Q4 2024**
• Additional Interest Income: ~$35-40M quarterly
• Required Capital: ~$180M (assuming 8% CAR)
• NIM Impact: +5-8bps (assuming current spreads)
• ROE Impact: +80-100bps

**Scenario 2: +50bps Interest Rate Change**
• Asset Repricing: +$65M quarterly (70% of book reprices within 6 months)
• Liability Repricing: +$45M quarterly (deposit beta ~0.7)
• Net Benefit: ~$20M quarterly (+15bps NIM)

**Scenario 3: Combined Impact**
• Total Revenue Uplift: $55-60M quarterly
• Incremental ROE: ~150-180bps
• Capital Requirement: Manageable within current buffers

**Risk Considerations:**
- Credit quality monitoring with rapid growth
- Funding mix optimization
- Competitive response in pricing`
    }

    if (lowerQuestion.includes("board deck") || lowerQuestion.includes("executive summary")) {
      return `## Executive Summary - Q3 2024 Board Deck

**Financial Performance:**
✅ **Strong Results:** Net profit of $485M (+12.5% YoY) with ROE of 14.2%
✅ **Revenue Growth:** $2.85B total revenue (+8.2% YoY) driven by NIM expansion
✅ **Efficiency Gains:** Cost-to-income ratio improved to 52.3% (-180bps YoY)

**Strategic Achievements:**
• Successfully repriced 65% of loan portfolio, improving NIM by 8bps
• SME segment growth of 12% QoQ with maintained credit quality
• Digital transformation initiatives showing 15% efficiency gains

**Key Concerns & Actions:**
⚠️ **Regulatory Impact:** Fee income pressure from interchange regulations
   → Action: Diversifying fee income sources, focus on advisory services

⚠️ **Credit Provisions:** 27.6% increase in provisions
   → Action: Enhanced monitoring of CRE portfolio, stress testing

**Strategic Priorities for Q4:**
1. Maintain loan growth momentum while preserving asset quality
2. Optimize funding mix to support NIM expansion
3. Accelerate digital banking adoption to drive fee income
4. Strengthen capital buffers ahead of Basel III implementation

**Outlook:** Well-positioned for continued growth with strong fundamentals`
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("benchmarking")) {
      return `## Peer Benchmarking Analysis - Q3 2024

**Net Interest Margin Comparison:**
• Our Bank: 3.45% ⭐ (Top quartile)
• Peer Average: 3.12%
• Best-in-class: 3.52% (Regional Bank A)
• Industry Median: 3.08%

**Return on Equity:**
• Our Bank: 14.2% ⭐ (Above average)
• Peer Average: 12.8%
• Best-in-class: 15.1% (Digital Bank B)
• Industry Median: 11.9%

**Efficiency Ratio:**
• Our Bank: 52.3% ⭐ (Strong performance)
• Peer Average: 58.7%
• Best-in-class: 48.2% (Tech-forward Bank C)
• Industry Median: 61.4%

**Asset Quality (NPL Ratio):**
• Our Bank: 1.8% ⭐ (Better than peers)
• Peer Average: 2.3%
• Best-in-class: 1.4% (Conservative Bank D)
• Industry Median: 2.7%

**Key Insights:**
✅ Leading in NIM and efficiency metrics
✅ Strong asset quality relative to peers
🔄 ROE competitive but room for improvement
📈 Opportunity to learn from digital leaders in cost management`
    }

    if (lowerQuestion.includes("profitability") || lowerQuestion.includes("profit margins")) {
      return `## Profitability Analysis

**Net Interest Margin Trends:**
• Q3 2024: 3.45% (+8bps QoQ, +25bps YoY)
• Key Drivers: Loan repricing (+15bps), deposit mix shift (-7bps)
• Outlook: Expect 3.50-3.55% in Q4 with continued repricing

**Return on Equity:**
• Q3 2024: 14.2% (+120bps YoY, +80bps QoQ)
• Components: Higher profitability + efficient capital utilization
• Target: Maintain 14-15% range through cycle

**Return on Assets:**
• Q3 2024: 1.28% (+15bps YoY)
• Reflects strong asset utilization and risk-adjusted returns

**Profitability Drivers:**
1. **Spread Management:** Active repricing of loan portfolio
2. **Volume Growth:** 12% QoQ loan growth in high-margin segments
3. **Cost Control:** Operating leverage from efficiency initiatives
4. **Risk Management:** Disciplined underwriting maintaining quality

**Margin Sustainability:**
• 70% of loan book reprices within 12 months
• Deposit franchise provides funding stability
• Fee income diversification reducing volatility`
    }

    if (lowerQuestion.includes("risk assessment") || lowerQuestion.includes("npl trends")) {
      return `## Risk Assessment - Q3 2024

**Credit Quality Indicators:**
• NPL Ratio: 1.8% (stable vs 1.7% in Q2)
• Provision Coverage: 68% (adequate for current risk profile)
• Net Charge-offs: 0.45% (within historical range)

**Portfolio Analysis:**
**Corporate Lending (45% of book):**
• NPL: 2.1% (slight uptick from 1.9%)
• Concentration: Well-diversified across sectors
• Concern: Commercial real estate exposure (12% of total)

**SME Lending (35% of book):**
• NPL: 1.8% (stable, strong underwriting)
• Growth: 12% QoQ with maintained standards
• Strength: Local market knowledge, relationship-based

**Retail Lending (20% of book):**
• NPL: 1.2% (best-in-class performance)
• Secured by real estate: 85% of portfolio
• Risk: Interest rate sensitivity of borrowers

**Forward-Looking Indicators:**
⚠️ **Economic Headwinds:** GDP growth slowing to 2.1%
⚠️ **Sector Stress:** Commercial real estate under pressure
✅ **Early Warning Systems:** Enhanced monitoring in place

**Risk Management Actions:**
• Increased provisions for CRE portfolio (+$18M)
• Tightened underwriting for new originations
• Stress testing for various economic scenarios
• Enhanced collection and recovery processes`
    }

    if (lowerQuestion.includes("efficiency") || lowerQuestion.includes("cost-to-income")) {
      return `## Operational Efficiency Analysis

**Cost-to-Income Ratio:**
• Q3 2024: 52.3% (-180bps YoY, -50bps QoQ)
• Industry Average: 58.7%
• Target: Sub-50% by end of 2025

**Efficiency Initiatives:**
**Digital Transformation:**
• 65% of transactions now digital (+15% YoY)
• Branch optimization: Closed 8 branches, opened 3 digital centers
• Savings: $12M annually from automation

**Process Optimization:**
• Straight-through processing: 78% of loan applications
• Customer onboarding time: Reduced from 5 days to 2 days
• Back-office consolidation: 15% FTE reduction

**Technology Investments:**
• Core banking upgrade: $25M investment showing ROI
• AI-powered risk assessment: 30% faster decisions
• Cloud migration: 20% reduction in IT infrastructure costs

**Productivity Metrics:**
• Revenue per FTE: $485K (+12% YoY)
• Loans per relationship manager: $45M (+18% YoY)
• Digital adoption rate: 78% of active customers

**Areas for Improvement:**
1. **Branch Network:** Further optimization opportunities
2. **Middle Office:** Automation of compliance processes
3. **Data Analytics:** Enhanced customer insights for cross-selling
4. **Vendor Management:** Consolidation and renegotiation

**2024 Efficiency Roadmap:**
Q4: Complete core system migration
2025: Launch AI-powered customer service
Target: Achieve sub-50% cost-to-income ratio`
    }

    // Original responses for basic questions
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
                    className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                      message.type === "user"
                        ? "bg-apple-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
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
          {/* Input field for continued conversation within the floating chat */}
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
