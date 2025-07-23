"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Minimize2, Maximize2, User, Bot } from "lucide-react"
import { AIChatInput } from "./ai-chat-input"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  isOpen: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  initialMessage?: string | null
}

export function ChatInterface({
  isOpen,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  initialMessage,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Earnings Assistant. I can help you analyze financial data, explain variances, and provide insights. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial message
  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!message) setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(messageToSend),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("earnings") || lowerMessage.includes("overview")) {
      return `Based on our Q3 2024 earnings data:

**Key Highlights:**
• Net Income: $1.25B (+5.9% QoQ)
• Total Revenue: $4.05B (+3.1% QoQ)
• Net Interest Margin: 3.45% (+7 bps QoQ)
• Return on Equity: 12.8% (+70 bps QoQ)

**Performance Summary:**
Our Q3 results show strong momentum with net income reaching $1.25 billion, representing a 5.9% increase from Q2. The improvement was driven by higher net interest income ($2.85B) and expanded net interest margin (3.45%).

**Key Drivers:**
- Interest rate environment benefited NIM expansion
- Loan growth of 2.4% supported revenue growth
- Credit quality remained stable with provisions at $180M

Would you like me to dive deeper into any specific metric or compare against industry benchmarks?`
    }

    if (lowerMessage.includes("variance") || lowerMessage.includes("analysis")) {
      return `**Q3 2024 vs Q2 2024 Variance Analysis:**

**Revenue Variances:**
• Net Interest Income: +$70M (+2.5%)
  - Rate environment: +$85M
  - Volume growth: +$15M
  - Mix impact: -$30M

• Non-Interest Income: +$50M (+4.3%)
  - Fee income: +$35M
  - Trading revenue: +$15M

**Expense Variances:**
• Loan Loss Provisions: +$15M (+9.1%)
  - Higher provision rate due to portfolio growth
  - Credit quality metrics remain stable

**Key Insights:**
The $70M increase in net interest income was primarily driven by favorable rate environment, while loan growth contributed positively. The 7 basis point NIM expansion reflects our asset-liability management effectiveness.

Would you like me to analyze specific line items or explain any variance drivers in more detail?`
    }

    if (lowerMessage.includes("scenario") || lowerMessage.includes("what-if")) {
      return `**What-If Scenario Analysis:**

**Scenario 1: 15% Loan Growth (Q4 2024)**
• Projected loan portfolio: $97.8B (vs current $85B)
• Estimated NII impact: +$180M annually
• Required funding: $12.8B additional deposits
• Capital impact: -45 bps to Tier 1 ratio

**Scenario 2: +50 bps Rate Environment**
• NIM expansion: +35-40 bps
• NII uplift: +$450M annually
• Deposit cost increase: +25-30 bps
• Net positive impact: +$280M

**Scenario 3: Economic Downturn**
• Provision expense: +$120M
• NIM compression: -15 bps
• Fee income decline: -8%
• Net income impact: -$180M

**Recommendations:**
- Loan growth scenario appears attractive if funding costs remain controlled
- Rate sensitivity analysis suggests positive correlation
- Stress testing indicates resilience in downturn scenarios

Which scenario would you like me to model in more detail?`
    }

    if (lowerMessage.includes("board") || lowerMessage.includes("deck")) {
      return `**Executive Summary - Q3 2024 Board Deck**

**Financial Performance:**
✅ **Strong Quarter:** Net income of $1.25B (+5.9% QoQ, +15.7% YoY)
✅ **Revenue Growth:** Total revenue $4.05B, driven by NIM expansion
✅ **Profitability:** ROE improved to 12.8%, exceeding peer median of 11.5%

**Key Achievements:**
• Net Interest Margin expanded 7 bps to 3.45%
• Efficiency ratio improved to 58.2% (target: <60%)
• Tier 1 capital ratio maintained at 12.5% (well above regulatory minimum)
• Loan growth of 2.4% with disciplined underwriting

**Areas of Focus:**
⚠️ **Credit Provisions:** Increased $15M QoQ, monitoring closely
⚠️ **Deposit Competition:** Funding costs rising, need strategic response
⚠️ **Regulatory Environment:** Preparing for potential capital requirement changes

**Strategic Priorities Q4:**
1. Maintain NIM discipline while growing core deposits
2. Optimize loan portfolio mix for risk-adjusted returns
3. Continue operational efficiency initiatives
4. Strengthen capital position ahead of regulatory changes

**Outlook:** Cautiously optimistic for Q4 with focus on sustainable growth and risk management.`
    }

    if (lowerMessage.includes("peer") || lowerMessage.includes("benchmark")) {
      return `**Peer Benchmarking Analysis - Q3 2024:**

**Profitability Metrics:**
• **ROE:** 12.8% vs Peer Median 11.5% ✅ (+130 bps)
• **ROA:** 1.15% vs Peer Median 1.08% ✅ (+7 bps)
• **NIM:** 3.45% vs Peer Median 3.28% ✅ (+17 bps)

**Efficiency & Quality:**
• **Efficiency Ratio:** 58.2% vs Peer Median 61.5% ✅ (-330 bps)
• **NPL Ratio:** 0.45% vs Peer Median 0.52% ✅ (-7 bps)
• **Provision Rate:** 0.21% vs Peer Median 0.28% ✅ (-7 bps)

**Capital Strength:**
• **Tier 1 Ratio:** 12.5% vs Peer Median 11.8% ✅ (+70 bps)
• **CET1 Ratio:** 11.2% vs Peer Median 10.6% ✅ (+60 bps)

**Competitive Position:**
🏆 **Top Quartile:** ROE, NIM, Efficiency Ratio
📈 **Above Median:** All key profitability and quality metrics
💪 **Strong Capital:** Well-positioned for growth and stress scenarios

**Key Differentiators:**
- Superior asset-liability management driving NIM outperformance
- Disciplined expense management maintaining efficiency advantage
- Conservative credit approach supporting quality metrics

Our performance ranks in the top 25% across most key metrics, demonstrating strong competitive positioning.`
    }

    if (lowerMessage.includes("risk") || lowerMessage.includes("assessment")) {
      return `**Comprehensive Risk Assessment - Q3 2024:**

**Credit Risk:**
🟢 **NPL Ratio:** 0.45% (stable, below peer median)
🟢 **Provision Coverage:** 185% (adequate buffer)
🟡 **Provision Expense:** $180M (+9% QoQ, monitoring trend)
🟢 **Charge-offs:** 0.18% (historically low levels)

**Interest Rate Risk:**
🟢 **Asset Sensitivity:** +$45M for +100 bps rate move
🟡 **Deposit Beta:** 35% (rising competitive pressure)
🟢 **Duration Gap:** Well-managed at 0.8 years

**Liquidity Risk:**
🟢 **LCR:** 125% (well above 100% requirement)
🟢 **Deposit Mix:** 78% core deposits (stable funding)
🟡 **Loan-to-Deposit:** 89% (approaching upper comfort zone)

**Operational Risk:**
🟢 **Cyber Security:** No material incidents, investments ongoing
🟢 **Regulatory Compliance:** Clean examination record
🟡 **Technology Modernization:** $150M investment program underway

**Market Risk:**
🟢 **Trading VaR:** $2.1M (within $5M limit)
🟢 **Securities Portfolio:** 85% government/agency (low risk)

**Overall Assessment:** MODERATE risk profile with strong capital buffers. Key focus areas: deposit competition and provision trend monitoring.

**Recommendations:**
- Enhance deposit retention strategies
- Continue credit monitoring in commercial portfolio
- Maintain strong capital position for flexibility`
    }

    if (lowerMessage.includes("efficiency") || lowerMessage.includes("operational")) {
      return `**Operational Efficiency Analysis - Q3 2024:**

**Efficiency Metrics:**
• **Efficiency Ratio:** 58.2% (Target: <60%) ✅
• **QoQ Improvement:** -160 bps (strong progress)
• **YoY Improvement:** -420 bps (significant gains)
• **Peer Ranking:** Top quartile performance

**Cost Management:**
💰 **Personnel Costs:** $1.45B (-2% QoQ)
  - Workforce optimization: -150 FTEs
  - Salary inflation: +3.2% annually
  - Benefits optimization: -$8M savings

🏢 **Occupancy Costs:** $285M (-5% QoQ)
  - Branch consolidation: 12 locations closed
  - Real estate optimization: $15M annual savings
  - Technology infrastructure: +$5M investment

📊 **Technology Costs:** $320M (+8% QoQ)
  - Digital transformation: $45M investment
  - Cybersecurity enhancement: $12M
  - Process automation: $18M (ROI: 18 months)

**Productivity Metrics:**
• **Revenue per FTE:** $485K (+12% YoY)
• **Assets per FTE:** $14.2M (+8% YoY)
• **Digital Adoption:** 78% (+15% YoY)

**Improvement Initiatives:**
🚀 **Process Automation:** 35% of routine tasks automated
🚀 **Digital Banking:** Mobile adoption up 22%
🚀 **Centralization:** Back-office consolidation 65% complete

**Q4 Focus Areas:**
1. Complete branch optimization program
2. Accelerate digital customer acquisition
3. Implement AI-powered customer service
4. Finalize back-office centralization

**Outlook:** Targeting sub-58% efficiency ratio by year-end through continued operational excellence.`
    }

    // Default response
    return `I understand you're asking about "${userMessage}". I can help you with:

• **Earnings Analysis** - Comprehensive performance reviews
• **Variance Analysis** - QoQ and YoY comparisons  
• **What-If Scenarios** - Financial modeling and projections
• **Board Reporting** - Executive summaries and key insights
• **Peer Benchmarking** - Competitive positioning analysis
• **Risk Assessment** - Credit, market, and operational risk reviews
• **Efficiency Analysis** - Cost management and productivity metrics

Could you please specify which area you'd like me to focus on, or ask a more specific question about our financial performance?`
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed bg-white border border-gray-200 shadow-2xl transition-all duration-300 z-50 ${
        isMaximized ? "inset-4 rounded-lg" : "bottom-4 right-4 w-96 h-[500px] rounded-xl"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-apple-blue-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-apple-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={isMaximized ? onMinimize : onMaximize}
            className="h-8 w-8 hover:bg-apple-blue-100"
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-apple-blue-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className={`${isMaximized ? "h-[calc(100vh-200px)]" : "h-[380px]"} p-4`}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-start space-x-2`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" ? "bg-apple-blue-600 ml-2" : "bg-gray-200 mr-2"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === "user" ? "bg-apple-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${message.sender === "user" ? "text-apple-blue-100" : "text-gray-500"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <AIChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          placeholder="Ask about earnings, variances, scenarios..."
        />
      </div>
    </div>
  )
}
