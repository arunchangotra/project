"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData } from "@/lib/sample-data"
import { financialRatios } from "@/lib/financial-ratios"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const currentQuarter = quarterlyData[0]

  const handleAskAI = (question: string) => {
    // This would trigger the chat interface with a pre-filled question
    console.log("Ask AI:", question)
  }

  // Get key financial ratios for display
  const keyMetrics = financialRatios.filter((ratio) =>
    ["NIM", "ROE", "ROA", "CAR", "CET1", "NPLR", "ER", "LDR"].includes(ratio.id),
  )

  // Prepare trend data for charts
  const trendData = quarterlyData
    .map((quarter) => ({
      quarter: quarter.quarter,
      revenue: quarter.revenue,
      netProfit: quarter.netProfit,
      nim: quarter.nim,
      roe: (quarter.netProfit / 6950) * 100, // Assuming 6.95B equity
    }))
    .reverse()

  // Helper to format metric values
  const formatValue = (value: number, unit: string) => {
    if (unit === "%") return `${value.toFixed(2)}%`
    if (unit === "x") return `${value.toFixed(2)}x`
    if (unit === "$M") return `$${value.toFixed(0)}M`
    return value.toFixed(2)
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
            <p className="text-gray-600">Q3 2024 Financial Performance Dashboard</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-apple-gray-200 text-gray-700">
          Last Updated: Nov 15 2024
        </Badge>
      </div>

      {/* Quick AI Questions */}
      <Card className="shadow-lg rounded-xl border-none bg-gradient-to-r from-apple-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
            <MessageSquare className="h-5 w-5 text-apple-blue-600" />
            <span>Ask AI about this data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
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
                className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-100 bg-white/80"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Primary KPI Snapshot */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quarterly Performance Snapshot</h2>
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
            title="Net Interest Margin"
            value={currentQuarter.nim}
            change={currentQuarter.yoyNim * 100}
            changeType="YoY"
            format="percentage"
          />
          <KPICard
            title="Cost-to-Income Ratio"
            value={currentQuarter.costToIncome}
            change={-1.6}
            changeType="YoY"
            format="percentage"
          />
          <KPICard
            title="Earnings Per Share"
            value={currentQuarter.eps}
            change={currentQuarter.yoyEps}
            changeType="YoY"
            format="currency"
            suffix=""
          />
        </div>
      </section>

      {/* Financial Ratios Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Key Financial Ratios</h2>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 bg-transparent"
          >
            <Link href="/variance">View Detailed Analysis</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const latestData = metric.historicalData[0]
            const previousData = metric.historicalData[1]
            const change = latestData && previousData ? latestData.value - previousData.value : 0
            const isPositive = change > 0
            const isNegative = change < 0

            return (
              <Card
                key={metric.id}
                className="shadow-md rounded-xl border-none hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className="text-xs rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
                  >
                    {metric.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {latestData ? formatValue(latestData.value, metric.unit) : "N/A"}
                  </div>
                  {latestData && (
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "flex items-center space-x-1 text-xs",
                          isPositive && "text-green-600",
                          isNegative && "text-red-600",
                          change === 0 && "text-gray-500",
                        )}
                      >
                        {isPositive && <TrendingUp className="h-3 w-3" />}
                        {isNegative && <TrendingDown className="h-3 w-3" />}
                        <span>
                          QoQ:{" "}
                          {latestData.qoqChange
                            ? `${latestData.qoqChange > 0 ? "+" : ""}${latestData.qoqChange.toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        YoY:{" "}
                        {latestData.yoyChange
                          ? `${latestData.yoyChange > 0 ? "+" : ""}${latestData.yoyChange.toFixed(1)}%`
                          : "N/A"}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500 line-clamp-2">{metric.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Performance Trends */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Performance Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue & Profit Trend */}
          <Card className="shadow-lg rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Revenue & Net Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenue ($M)", color: "hsl(var(--chart-1))" },
                  netProfit: { label: "Net Profit ($M)", color: "hsl(var(--chart-2))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="netProfit"
                      stroke="var(--color-netProfit)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Net Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Profitability Metrics Trend */}
          <Card className="shadow-lg rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Profitability Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  nim: { label: "NIM (%)", color: "hsl(var(--chart-3))" },
                  roe: { label: "ROE (%)", color: "hsl(var(--chart-4))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="nim"
                      stroke="var(--color-nim)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="NIM"
                    />
                    <Line
                      type="monotone"
                      dataKey="roe"
                      stroke="var(--color-roe)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="ROE"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Summary */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">AI Performance Summary</CardTitle>
            <p className="text-gray-600">Automated quarterly performance analysis</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAskAI("Explain this quarter's performance in detail")}
            className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p>
              <strong>Q3 2024 Performance Summary:</strong> This quarter delivered exceptional results with revenue
              rising 8.2% YoY to $2.85B, driven primarily by retail deposit inflows and improved lending margins in the
              SME segment. Net profit increased 12.5% YoY to $890M, benefiting from strong fee income growth and
              disciplined cost management.
            </p>
            <p className="mt-4">
              <strong>Key Highlights:</strong> Net Interest Margin improved 8bps QoQ to 3.45%, reflecting successful
              repricing of the loan portfolio amid the rising rate environment. Cost-to-income ratio improved to 58.2%
              from 59.8% in Q2, demonstrating operational efficiency gains. However, loan loss provisions increased
              27.6% QoQ due to a cautious stance on commercial real estate exposure.
            </p>
            <p className="mt-4">
              <strong>Outlook:</strong> EPS grew 11.8% YoY to $4.25, exceeding analyst expectations of $4.10. Capital
              adequacy remains strong with CET1 at 12.1%, providing ample capacity for future growth initiatives while
              maintaining robust risk buffers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
