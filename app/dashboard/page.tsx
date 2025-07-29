"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData } from "@/lib/sample-data"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const currentQuarter = quarterlyData[0]

  const handleAskAI = (question: string) => {
    // This would trigger the chat interface with a pre-filled question
    console.log("Ask AI:", question)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-6">
              <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Link>
              </Button>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Earnings Overview</h1>
                <p className="text-lg text-gray-600 leading-relaxed">Q3 2024 Financial Performance</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2 rounded-full bg-apple-gray-200 text-gray-700">
              Last Updated: Nov 15 2024
            </Badge>
          </div>

          {/* Quick AI Questions */}
          <Card className="shadow-lg rounded-xl border-none bg-gradient-to-r from-apple-blue-50 to-indigo-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <MessageSquare className="h-5 w-5 text-apple-blue-600" />
                <span>Ask AI about this data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap gap-3">
                {[
                  "Why did revenue grow 8.2% this quarter?",
                  "What's driving the NIM improvement?",
                  "How does our ROE compare to peers?",
                  "Explain the cost-to-income improvement",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAskAI(question)}
                    className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-100 bg-white/80 px-4 py-2"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPI Snapshot */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Quarterly Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            </div>
          </section>

          {/* AI Summary */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">AI Summary</CardTitle>
                <p className="text-gray-600 text-base leading-relaxed">Automated quarterly performance analysis</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAskAI("Explain this quarter's performance in detail")}
                className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 px-4 py-2"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>Q3 2024 Performance Summary:</strong> This quarter, revenue rose by 8.2% YoY to $2.85B, driven
                  primarily by retail deposit inflows and improved lending margins in the SME segment. Net profit
                  increased 12.5% YoY to $890M, benefiting from strong fee income growth and disciplined cost
                  management. Net Interest Margin improved 8bps QoQ to 3.45%, reflecting successful repricing of the
                  loan portfolio amid rising rate environment.
                </p>
                <p>
                  <strong>Key Highlights:</strong> Cost-to-income ratio improved to 58.2% from 59.8% in Q2,
                  demonstrating operational efficiency gains. However, loan loss provisions increased 27.6% QoQ due to
                  cautious stance on commercial real estate exposure. EPS grew 11.8% YoY to $4.25, exceeding analyst
                  expectations of $4.10.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
