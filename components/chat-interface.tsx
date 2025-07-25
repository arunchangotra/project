"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Copy,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  Users,
  DollarSign,
  Target,
  Activity,
} from "lucide-react"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData, detailedVarianceData, peerBenchmarkData } from "@/lib/sample-data"
import { financialRatios } from "@/lib/financial-ratios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string | React.ReactNode
  timestamp: Date
  citation?: string
}

interface ChatInterfaceProps {
  isMaximized: boolean
  initialMessage: string | null
}

export function ChatInterface({ isMaximized, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI Earnings Assistant. I can help you analyze Q3 2024 financial performance, explain variances, run scenarios, draft board presentations, and much more. What would you like to explore?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedSegment, setSelectedSegment] = useState("All")
  const [inputs, setInputs] = useState({
    loanGrowth: 0,
    depositRateChange: 0,
    provisioningChange: 0,
    feeGrowth: 0,
    costGrowth: 0,
  })

  const [results, setResults] = useState({
    netProfit: 890,
    nim: 3.45,
    roe: 12.8,
    eps: 4.25,
  })
  const [selectedTone, setSelectedTone] = useState("Executive")
  const [selectedAudience, setSelectedAudience] = useState("Board of Directors")
  const [userPrompt, setUserPrompt] = useState("")

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
        citation: "Based on Q3 2024 MIS data and comprehensive financial analysis",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string | React.ReactNode => {
    const lowerQuestion = question.toLowerCase()

    // Handle specific feature requests
    if (lowerQuestion.includes("earnings overview") || lowerQuestion.includes("quarterly snapshot")) {
      return generateEarningsOverview()
    }

    if (lowerQuestion.includes("variance analysis") || lowerQuestion.includes("line item")) {
      return generateVarianceAnalysis()
    }

    if (lowerQuestion.includes("what-if") || lowerQuestion.includes("scenario")) {
      return generateScenarioBuilder()
    }

    if (lowerQuestion.includes("board deck") || lowerQuestion.includes("presentation")) {
      return generateBoardDeckContent()
    }

    if (lowerQuestion.includes("peer") || lowerQuestion.includes("compare") || lowerQuestion.includes("benchmark")) {
      return generatePeerComparison()
    }

    if (lowerQuestion.includes("profitability") || lowerQuestion.includes("roe") || lowerQuestion.includes("roa")) {
      return generateProfitabilityAnalysis()
    }

    if (lowerQuestion.includes("risk") || lowerQuestion.includes("npl") || lowerQuestion.includes("asset quality")) {
      return generateRiskAssessment()
    }

    if (
      lowerQuestion.includes("efficiency") ||
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("operational")
    ) {
      return generateEfficiencyAnalysis()
    }

    // Handle specific metric questions
    if (lowerQuestion.includes("nim") || lowerQuestion.includes("margin")) {
      return generateNIMAnalysis()
    }

    if (lowerQuestion.includes("provision")) {
      return generateProvisionAnalysis()
    }

    return generateDefaultResponse()
  }

  const generateEarningsOverview = () => {
    const currentQuarter = quarterlyData[0]

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Q3 2024 Earnings Overview</h3>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard
            title="Revenue"
            value={currentQuarter.revenue}
            change={currentQuarter.yoyRevenue}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="Net Profit"
            value={currentQuarter.netProfit}
            change={currentQuarter.yoyNetProfit}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="NIM"
            value={currentQuarter.nim}
            change={currentQuarter.yoyNim * 100}
            changeType="YoY"
            format="percentage"
          />
          <KPICard
            title="Cost-to-Income"
            value={currentQuarter.costToIncome}
            change={-1.6}
            changeType="YoY"
            format="percentage"
          />
          <KPICard title="EPS" value={currentQuarter.eps} change={currentQuarter.yoyEps} changeType="YoY" />
          <KPICard title="ROE" value={12.8} change={0.8} changeType="YoY" format="percentage" />
        </div>

        {/* Historical Trend Chart */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Quarterly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue ($M)", color: "hsl(var(--chart-1))" },
                netProfit: { label: "Net Profit ($M)", color: "hsl(var(--chart-2))" },
                nim: { label: "NIM (%)", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyData.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                  <Line type="monotone" dataKey="netProfit" stroke="var(--color-netProfit)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">AI Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Q3 2024 Performance Highlights:</strong> The bank delivered exceptional results with revenue
                growing 8.2% YoY to $2.85B, driven by strong lending activity and optimized interest margins. Net profit
                surged 12.5% YoY to $890M, reflecting effective cost management and strategic execution.
              </p>
              <p className="mt-3">
                <strong>Key Drivers:</strong> NIM expansion (+8bps QoQ to 3.45%) from successful loan repricing,
                improved operational efficiency (Cost-to-Income ratio down to 58.2%), and robust EPS growth (+11.8% YoY
                to $4.25). The bank maintains strong capital adequacy while delivering superior shareholder returns.
              </p>
              <p className="mt-3">
                <strong>Strategic Outlook:</strong> Management remains focused on sustainable growth through digital
                transformation, disciplined capital allocation, and maintaining robust risk frameworks. The strong Q3
                performance positions the bank well for continued market leadership.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Show detailed variance analysis for Q3 2024")}
            className="rounded-full text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Variance Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Compare our performance with industry peers")}
            className="rounded-full text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            Peer Comparison
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Run what-if scenarios for next quarter")}
            className="rounded-full text-xs"
          >
            <Calculator className="h-3 w-3 mr-1" />
            Scenarios
          </Button>
        </div>
      </div>
    )
  }

  const generateVarianceAnalysis = () => {
    const topLevelItems = detailedVarianceData.filter((item) => item.level === 0)

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Variance Analysis - Q3 2024</h3>
        </div>

        {/* Filters */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-800">Analysis Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Segment:</Label>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Treasury">Treasury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variance Table */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Key Line Item Variances</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line Item</TableHead>
                  <TableHead className="text-right">Q3 2024</TableHead>
                  <TableHead className="text-right">Q2 2024</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead>Segment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLevelItems.map((item) => (
                  <Sheet key={item.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">${item.current || 0}M</TableCell>
                        <TableCell className="text-right">${item.previous || 0}M</TableCell>
                        <TableCell className="text-right">
                          <span className={item.variance && item.variance > 0 ? "text-green-600" : "text-red-600"}>
                            {item.variance ? `$${item.variance}M` : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={item.variancePercent && item.variancePercent > 0 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.variancePercent ? `${item.variancePercent.toFixed(1)}%` : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.segment || "Consolidated"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent className="w-[600px]">
                      <SheetHeader>
                        <SheetTitle>{item.category} - Detailed Analysis</SheetTitle>
                        <SheetDescription>Driver breakdown and variance explanation</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">AI Explanation</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700">{item.aiExplanation}</p>
                          </CardContent>
                        </Card>
                        {item.drivers && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Key Drivers</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {item.drivers.map((driver: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{driver.name}</span>
                                    <span
                                      className={`text-sm font-medium ${
                                        driver.impact === "positive"
                                          ? "text-green-600"
                                          : driver.impact === "negative"
                                            ? "text-red-600"
                                            : "text-gray-600"
                                      }`}
                                    >
                                      {driver.impact === "positive" && "+"}${driver.value}M
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Variance Chart */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Variance Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                variance: { label: "Variance ($M)", color: "hsl(var(--chart-1))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLevelItems.filter((item) => item.variance !== undefined)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="variance" fill="var(--color-variance)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateScenarioBuilder = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">What-If Scenario Builder</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <Card className="shadow-md rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-800">Scenario Inputs</CardTitle>
              <CardDescription className="text-sm">Adjust key business levers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Loan Growth (%)</Label>
                <Slider
                  value={[inputs.loanGrowth]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, loanGrowth: value[0] }))}
                  max={20}
                  min={-10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-10%</span>
                  <span className="font-medium text-gray-800">{inputs.loanGrowth}%</span>
                  <span>+20%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Deposit Rate Change (bps)</Label>
                <Slider
                  value={[inputs.depositRateChange]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, depositRateChange: value[0] }))}
                  max={100}
                  min={-50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-50bps</span>
                  <span className="font-medium text-gray-800">{inputs.depositRateChange}bps</span>
                  <span>+100bps</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Fee Income Growth (%)</Label>
                <Slider
                  value={[inputs.feeGrowth]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, feeGrowth: value[0] }))}
                  max={15}
                  min={-15}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-15%</span>
                  <span className="font-medium text-gray-800">{inputs.feeGrowth}%</span>
                  <span>+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-md rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-800">Projected Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">$925M</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                  <div className="text-sm text-green-600">+$35M (+4.0%)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">3.52%</div>
                  <div className="text-sm text-gray-600">NIM</div>
                  <div className="text-sm text-green-600">+7bps</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">13.2%</div>
                  <div className="text-sm text-gray-600">ROE</div>
                  <div className="text-sm text-green-600">+0.4%</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">$4.41</div>
                  <div className="text-sm text-gray-600">EPS</div>
                  <div className="text-sm text-green-600">+$0.16</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Impact Summary */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">AI Impact Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Scenario Analysis:</strong> The current input combination projects a positive impact on key
              financial metrics. Net profit is expected to increase by $35M (+4.0%) driven by loan growth and fee income
              expansion. NIM improvement of 7bps reflects optimized asset-liability management. The scenario suggests a
              favorable environment for sustainable earnings growth while maintaining strong capital adequacy ratios.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateBoardDeckContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Board Presentation Assistant</h3>
        </div>

        {/* Generation Controls */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Content Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Tone</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Analytical">Analytical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Audience</Label>
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Board of Directors">Board of Directors</SelectItem>
                    <SelectItem value="Investors">Investors</SelectItem>
                    <SelectItem value="Regulators">Regulators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Focus Areas</Label>
                <Textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., Emphasize NIM growth and capital strength"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Executive Summary Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Q3 2024 Financial Performance Summary</h4>

              <p className="mb-3">
                <strong>Executive Overview:</strong> The Bank delivered robust financial performance in Q3 2024,
                demonstrating resilience and strategic execution amidst evolving market dynamics. Revenue surged by 8.2%
                YoY to $2.85 Billion, primarily fueled by strong lending activity and optimized net interest margin.
              </p>

              <div className="mb-4">
                <strong>Key Financial Highlights:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <strong>Revenue:</strong> $2.85B (+8.2% YoY, +3.1% QoQ) - Strong growth across core segments
                  </li>
                  <li>
                    <strong>Net Profit:</strong> $890M (+12.5% YoY, +5.8% QoQ) - Exceeding expectations through
                    operational efficiency
                  </li>
                  <li>
                    <strong>Net Interest Margin:</strong> 3.45% (+8bps QoQ) - Benefiting from strategic repricing
                  </li>
                  <li>
                    <strong>Cost-to-Income Ratio:</strong> 58.2% (improved from 59.8% in Q2) - Reflecting ongoing
                    optimization
                  </li>
                  <li>
                    <strong>Earnings Per Share:</strong> $4.25 (+11.8% YoY) - Delivering enhanced shareholder value
                  </li>
                </ul>
              </div>

              <p className="mb-3">
                <strong>Strategic Progress:</strong> Continued momentum in retail banking with SME loan growth of 12%
                QoQ. Digital adoption rates increased by 15%, enhancing customer experience and operational efficiency.
                Corporate banking maintained stable performance with targeted growth in key sectors.
              </p>

              <p>
                <strong>Outlook:</strong> We remain confident in our ability to navigate future challenges and
                capitalize on growth opportunities. Key priorities include accelerating digital transformation,
                disciplined balance sheet management, and strategic expansion in high-growth segments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
            Export to PowerPoint
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
            Export to Word
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs bg-transparent">
            Generate More Content
          </Button>
        </div>
      </div>
    )
  }

  const generatePeerComparison = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Peer Benchmarking Analysis</h3>
        </div>

        {/* Peer Comparison Chart */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Key Metrics vs Industry Peers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                nim: { label: "NIM (%)", color: "hsl(var(--chart-1))" },
                roe: { label: "ROE (%)", color: "hsl(var(--chart-2))" },
                costToIncome: { label: "Cost-to-Income (%)", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerBenchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bank" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="nim" fill="var(--color-nim)" name="NIM (%)" />
                  <Bar dataKey="roe" fill="var(--color-roe)" name="ROE (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Detailed Comparison Table */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Detailed Peer Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead className="text-right">NIM (%)</TableHead>
                  <TableHead className="text-right">ROE (%)</TableHead>
                  <TableHead className="text-right">Cost-to-Income (%)</TableHead>
                  <TableHead>Ranking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peerBenchmarkData.map((peer, index) => (
                  <TableRow key={peer.bank} className={peer.bank === "Our Bank" ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">
                      {peer.bank}
                      {peer.bank === "Our Bank" && <Badge className="ml-2 text-xs">Us</Badge>}
                    </TableCell>
                    <TableCell className="text-right">{peer.nim.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{peer.roe.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{peer.costToIncome.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant={index < 2 ? "default" : "secondary"} className="text-xs">
                        {index === 0 ? "Top Performer" : index === 1 ? "Above Average" : "Average"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Competitive Position Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Performance Assessment:</strong> Our bank demonstrates competitive positioning across key
                metrics. NIM of 3.45% is slightly above industry average (3.44%) but below top performer Peer A (3.52%).
                Our ROE of 12.8% is strong and above industry average, indicating effective capital utilization.
              </p>
              <p className="mt-3">
                <strong>Operational Efficiency:</strong> Cost-to-income ratio of 58.2% shows good operational
                efficiency, matching industry standards and demonstrating effective cost management. This positions us
                favorably for sustained profitability.
              </p>
              <p className="mt-3">
                <strong>Strategic Recommendations:</strong> Focus on further NIM optimization through strategic
                repricing and product mix enhancement. Maintain current operational efficiency levels while investing in
                growth initiatives. Monitor peer strategies for competitive intelligence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateProfitabilityAnalysis = () => {
    const profitabilityMetrics = financialRatios.filter((metric) => metric.category === "Profitability")

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Profitability Deep Dive</h3>
        </div>

        {/* Profitability Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profitabilityMetrics.map((metric) => (
            <Card key={metric.id} className="shadow-md rounded-xl border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.historicalData[0]?.value.toFixed(2)}
                  {metric.unit}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  YoY:{" "}
                  <span
                    className={
                      metric.historicalData[0]?.yoyChange && metric.historicalData[0].yoyChange > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {metric.historicalData[0]?.yoyChange?.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profitability Trend */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Profitability Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ROA: { label: "ROA (%)", color: "hsl(var(--chart-1))" },
                ROE: { label: "ROE (%)", color: "hsl(var(--chart-2))" },
                NIM: { label: "NIM (%)", color: "hsl(var(--chart-3))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitabilityMetrics[0]?.historicalData.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="var(--color-ROA)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Profitability Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Strong Profitability Performance:</strong> Our profitability metrics demonstrate robust financial
              health with ROE of 12.8% and ROA of 1.28%, both above industry benchmarks. NIM expansion to 3.45% reflects
              effective asset-liability management and strategic pricing discipline. The consistent improvement across
              quarters indicates sustainable earnings quality and effective capital deployment strategies.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateRiskAssessment = () => {
    const riskMetrics = financialRatios.filter((metric) => metric.category === "Asset Quality")

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Risk & Asset Quality Assessment</h3>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskMetrics.map((metric) => (
            <Card key={metric.id} className="shadow-md rounded-xl border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.historicalData[0]?.value.toFixed(2)}
                  {metric.unit}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  YoY:{" "}
                  <span
                    className={
                      metric.historicalData[0]?.yoyChange && metric.historicalData[0].yoyChange < 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {metric.historicalData[0]?.yoyChange?.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Analysis */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Risk Profile Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Asset Quality Status:</strong> NPL ratio of 1.8% remains well within acceptable limits and below
                industry average. The proactive increase in loan loss provisions to $125M reflects prudent risk
                management, particularly regarding commercial real estate exposure.
              </p>
              <p className="mt-3">
                <strong>Credit Risk Management:</strong> Our robust underwriting standards and diversified portfolio
                continue to support stable asset quality. The provision coverage ratio demonstrates adequate buffers for
                potential credit losses.
              </p>
              <p className="mt-3">
                <strong>Forward-Looking Assessment:</strong> Management maintains a cautious stance on emerging risks
                while supporting business growth. Enhanced monitoring of specific sectors and geographies ensures early
                identification of potential stress points.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateEfficiencyAnalysis = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-apple-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Operational Efficiency Analysis</h3>
        </div>

        {/* Efficiency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md rounded-xl border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800">Cost-to-Income Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">58.2%</div>
              <div className="text-sm text-green-600 mt-1">-1.6% YoY improvement</div>
              <p className="text-xs text-gray-500 mt-2">Measures operational efficiency and cost control</p>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800">Operating Leverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">4.6%</div>
              <div className="text-sm text-green-600 mt-1">Positive operating leverage</div>
              <p className="text-xs text-gray-500 mt-2">Revenue growth exceeding expense growth</p>
            </CardContent>
          </Card>
        </div>

        {/* Efficiency Analysis */}
        <Card className="shadow-md rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Efficiency Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Operational Excellence:</strong> Cost-to-income ratio improvement to 58.2% demonstrates effective
              cost management and operational efficiency gains. The bank achieved positive operating leverage with
              revenue growth of 8.2% outpacing expense growth of 3.2%. Digital transformation initiatives and process
              optimization continue to drive productivity improvements while maintaining service quality standards.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateNIMAnalysis = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-apple-blue-600" />
          <h4 className="font-semibold text-gray-800">Net Interest Margin Analysis</h4>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardContent className="p-4">
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Q3 2024 NIM Performance:</strong> Net Interest Margin improved 8bps QoQ to 3.45%, driven by
                successful repricing of our loan portfolio (+15bps impact) and favorable deposit mix shift. The retail
                lending segment contributed most significantly with SME loans repriced at higher spreads.
              </p>
              <p className="mt-3">
                <strong>Key Drivers:</strong>
              </p>
              <ul className="mt-2 space-y-1">
                <li>Loan portfolio repricing: +15bps impact</li>
                <li>Asset yield optimization: +12bps</li>
                <li>Deposit cost management: -7bps impact from competitive pressures</li>
                <li>Product mix enhancement: +3bps from higher-margin products</li>
              </ul>
              <p className="mt-3">
                <strong>Outlook:</strong> Management expects continued NIM expansion through strategic repricing
                initiatives and disciplined deposit pricing, though competitive pressure in corporate lending may limit
                upside potential.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateProvisionAnalysis = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-apple-blue-600" />
          <h4 className="font-semibold text-gray-800">Loan Loss Provision Analysis</h4>
        </div>

        <Card className="shadow-md rounded-xl border-none">
          <CardContent className="p-4">
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Q3 2024 Provision Increase:</strong> Loan loss provisions increased 27.6% QoQ to $125M,
                reflecting management's cautious approach to emerging credit risks and forward-looking economic
                assessments.
              </p>
              <p className="mt-3">
                <strong>Key Components:</strong>
              </p>
              <ul className="mt-2 space-y-1">
                <li>Commercial real estate exposure: $18M increase reflecting market stress</li>
                <li>Forward-looking economic adjustments: $7M based on updated macro scenarios</li>
                <li>Specific provisions: $2M for single large corporate account</li>
                <li>General provisions: Maintained adequate coverage ratios</li>
              </ul>
              <p className="mt-3">
                <strong>Risk Management:</strong> The proactive provisioning approach demonstrates prudent risk
                management while maintaining strong coverage ratios. Management continues to monitor portfolio quality
                closely with enhanced focus on vulnerable sectors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateDefaultResponse = () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          I can help you analyze various aspects of our Q3 2024 financial performance. Here are some areas I can assist
          with:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Show me the complete earnings overview")}
            className="rounded-full text-xs justify-start"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Earnings Overview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Perform detailed variance analysis")}
            className="rounded-full text-xs justify-start"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Variance Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Compare with industry peers")}
            className="rounded-full text-xs justify-start"
          >
            <Users className="h-3 w-3 mr-1" />
            Peer Comparison
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSend("Run what-if scenarios")}
            className="rounded-full text-xs justify-start"
          >
            <Calculator className="h-3 w-3 mr-1" />
            Scenarios
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          You can also ask specific questions about metrics like NIM, ROE, provisions, or any other financial aspect.
        </p>
      </div>
    )
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="shadow-lg rounded-xl border-none flex flex-col flex-1 min-h-0">
        <CardHeader className="pb-1 flex-shrink-0">
          <CardTitle className="text-sm font-semibold text-gray-800">AI Earnings Assistant</CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Comprehensive financial analysis and insights for Q3 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-2">
          <ScrollArea className="flex-1 w-full border border-gray-200 rounded-xl p-2 bg-apple-gray-50 min-h-0">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[92%] rounded-xl p-2.5 shadow-sm ${
                      message.type === "user"
                        ? "bg-apple-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="text-sm">
                      {typeof message.content === "string" ? message.content : message.content}
                    </div>
                    {message.citation && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-200 text-gray-500 text-xs">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
                        >
                          {message.citation}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(typeof message.content === "string" ? message.content : "Content copied")
                        }
                        className="h-5 w-5 p-0 text-gray-500 hover:bg-apple-gray-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-200">
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
          {/* Input field - always visible at bottom */}
          <div className="flex space-x-2 flex-shrink-0 pt-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about earnings, metrics, scenarios, or any financial analysis..."
              onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
              disabled={isLoading}
              className="rounded-full px-4 py-2 border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 text-sm"
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
