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

    // Simulate AI response with static content
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateStaticResponse(messageContent),
        timestamp: new Date(),
        citation: "Based on Q3 2024 MIS data and variance analysis",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateStaticResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

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

    if (lowerQuestion.includes("15%") || lowerQuestion.includes("growth")) {
      return "If loan growth was 15% next quarter, we project: Net Interest Income would increase by approximately $45M (+6.2%), driven by higher earning assets. NIM would likely compress by 2-3bps due to competitive pricing on new originations. Credit costs would rise by $8-12M reflecting higher provision requirements. Overall, net profit impact would be positive at +$25-30M, assuming stable funding costs and no significant credit deterioration."
    }

    if (lowerQuestion.includes("executive") || lowerQuestion.includes("summary")) {
      return "Q3 2024 Executive Summary: Strong financial performance with revenue up 8.2% YoY to $2.85B, driven by NIM expansion and loan growth. Net profit increased 12.5% YoY to $890M, reflecting operational efficiency gains. Key highlights include: NIM improved to 3.45% (+8bps QoQ), Cost-to-Income ratio at 58.2% (improved from 59.8%), ROE of 12.8% (+80bps YoY), and EPS of $4.25 (+11.8% YoY). Outlook remains positive with continued focus on digital transformation and disciplined growth."
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("roe") || lowerQuestion.includes("compare")) {
      return "Peer Comparison Analysis: Our ROE of 12.8% ranks 2nd among regional peers, above the industry average of 11.5%. Top performer (Peer A) achieved 13.2% ROE. Our NIM of 3.45% is competitive, matching industry average but below Peer A's 3.52%. Cost-to-Income ratio of 58.2% demonstrates strong operational efficiency, better than industry average of 61.3%. Overall, we maintain a strong competitive position with room for NIM optimization."
    }

    if (lowerQuestion.includes("cost") || lowerQuestion.includes("income") || lowerQuestion.includes("efficiency")) {
      return "Cost-to-Income Analysis: Our ratio improved to 58.2% in Q3 2024, down from 59.8% in Q2, demonstrating strong operational efficiency. Key drivers include: Revenue growth of 8.2% YoY outpacing expense growth of 3.2%, Digital transformation savings of $12M annually, Branch optimization reducing occupancy costs by $3M, and Automation of back-office processes improving productivity by 15%. We target further improvement to 57% by year-end through continued efficiency initiatives."
    }

    // Default response
    return "I can help analyze various aspects of our Q3 2024 performance. Could you be more specific about which metric or area you'd like me to focus on? I have detailed data on revenue, margins, provisions, fee income, loan performance, peer comparisons, and can run various scenarios for you."
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
                    <div className="text-sm">{message.content}</div>
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
