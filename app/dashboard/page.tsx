"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData, currentQuarter, previousQuarter } from "@/lib/sample-data"

export default function DashboardPage() {
  const current = quarterlyData[currentQuarter as keyof typeof quarterlyData]
  const previous = quarterlyData[previousQuarter as keyof typeof quarterlyData]

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      type: change >= 0 ? ("positive" as const) : ("negative" as const),
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  const quickQuestions = [
    "Explain the NIM improvement",
    "What drove revenue growth?",
    "How is our ROE trending?",
    "Compare to industry peers",
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
            <p className="text-gray-600">{currentQuarter} Financial Performance Dashboard</p>
          </div>
        </div>
        <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask AI
        </Button>
      </div>

      {/* Quick AI Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick AI Questions</CardTitle>
          <CardDescription>Get instant insights about your financial performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-apple-blue-600 border-apple-blue-200 hover:bg-apple-blue-50 bg-transparent"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Snapshot */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">KPI Snapshot</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Net Income"
            value={formatCurrency(current.netIncome)}
            change={`+${calculateChange(current.netIncome, previous.netIncome).value}% QoQ`}
            changeType={calculateChange(current.netIncome, previous.netIncome).type}
            description="Quarterly net income"
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(current.totalRevenue)}
            change={`+${calculateChange(current.totalRevenue, previous.totalRevenue).value}% QoQ`}
            changeType={calculateChange(current.totalRevenue, previous.totalRevenue).type}
            description="Net interest + non-interest income"
          />
          <KPICard
            title="Net Interest Margin"
            value={`${current.netInterestMargin}%`}
            change={`+${((current.netInterestMargin - previous.netInterestMargin) * 100).toFixed(0)} bps QoQ`}
            changeType="positive"
            description="NII / Average earning assets"
          />
          <KPICard
            title="Return on Equity"
            value={`${current.returnOnEquity}%`}
            change={`+${((current.returnOnEquity - previous.returnOnEquity) * 100).toFixed(0)} bps QoQ`}
            changeType="positive"
            description="Net income / Average equity"
          />
          <KPICard
            title="Efficiency Ratio"
            value={`${current.efficiencyRatio}%`}
            change={`${((current.efficiencyRatio - previous.efficiencyRatio) * 100).toFixed(0)} bps QoQ`}
            changeType={current.efficiencyRatio < previous.efficiencyRatio ? "positive" : "negative"}
            description="Non-interest expense / Revenue"
          />
        </div>
      </div>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>Key insights and performance analysis for {currentQuarter}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong>Exceptional {currentQuarter} Performance:</strong> The bank delivered outstanding results with
                net income of {formatCurrency(current.netIncome)}, marking a{" "}
                {calculateChange(current.netIncome, previous.netIncome).value}% increase quarter-over-quarter. This
                strong performance was driven by net interest margin expansion to {current.netInterestMargin}% and
                continued operational efficiency improvements.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Profitability Excellence:</strong> Return on equity reached {current.returnOnEquity}%,
                significantly outperforming industry benchmarks and demonstrating effective capital deployment. The
                efficiency ratio of {current.efficiencyRatio}% reflects disciplined expense management and operational
                excellence initiatives.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Strategic Position:</strong> With a robust Tier 1 capital ratio of {current.tier1CapitalRatio}%
                and strong asset quality metrics, the bank is well-positioned for sustainable growth while maintaining
                prudent risk management practices.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <Button size="sm" className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Dive Deeper into Performance
              </Button>
              <Button size="sm" variant="outline">
                Compare to Peers
              </Button>
              <Button size="sm" variant="outline">
                Generate Board Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
