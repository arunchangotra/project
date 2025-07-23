"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calculator, FileText, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData, currentQuarter, previousQuarter } from "@/lib/sample-data"

export default function HomePage() {
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
    "What drove the NIM expansion this quarter?",
    "How do we compare to industry peers?",
    "What are the key risks to monitor?",
    "Generate board deck summary",
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to AI Earnings Assistant</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your intelligent financial analysis companion. Get instant insights, variance analysis, and strategic
          recommendations powered by AI.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
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
      </div>

      {/* KPI Snapshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">KPI Snapshot - {currentQuarter}</h2>
          <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Net Income"
            value={formatCurrency(current.netIncome)}
            change={`+${calculateChange(current.netIncome, previous.netIncome).value}% QoQ`}
            changeType={calculateChange(current.netIncome, previous.netIncome).type}
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(current.totalRevenue)}
            change={`+${calculateChange(current.totalRevenue, previous.totalRevenue).value}% QoQ`}
            changeType={calculateChange(current.totalRevenue, previous.totalRevenue).type}
          />
          <KPICard
            title="Net Interest Margin"
            value={`${current.netInterestMargin}%`}
            change={`+${((current.netInterestMargin - previous.netInterestMargin) * 100).toFixed(0)} bps QoQ`}
            changeType="positive"
          />
          <KPICard
            title="Return on Equity"
            value={`${current.returnOnEquity}%`}
            change={`+${((current.returnOnEquity - previous.returnOnEquity) * 100).toFixed(0)} bps QoQ`}
            changeType="positive"
          />
          <KPICard
            title="Efficiency Ratio"
            value={`${current.efficiencyRatio}%`}
            change={`${((current.efficiencyRatio - previous.efficiencyRatio) * 100).toFixed(0)} bps QoQ`}
            changeType={current.efficiencyRatio < previous.efficiencyRatio ? "positive" : "negative"}
          />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-apple-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <CardTitle className="group-hover:text-apple-blue-600 transition-colors">Earnings Overview</CardTitle>
              <CardDescription>Comprehensive dashboard with key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-apple-blue-600 text-sm font-medium">
                View Dashboard
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/variance">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-apple-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <CardTitle className="group-hover:text-apple-blue-600 transition-colors">Variance Analysis</CardTitle>
              <CardDescription>Automated analysis of performance variances with AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-apple-blue-600 text-sm font-medium">
                Analyze Variances
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/scenarios">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <Calculator className="h-10 w-10 text-apple-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <CardTitle className="group-hover:text-apple-blue-600 transition-colors">What-If Scenarios</CardTitle>
              <CardDescription>Model different scenarios and understand potential impacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-apple-blue-600 text-sm font-medium">
                Run Scenarios
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/board-deck">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <FileText className="h-10 w-10 text-apple-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <CardTitle className="group-hover:text-apple-blue-600 transition-colors">Board Deck</CardTitle>
              <CardDescription>Generate executive summaries and board-ready presentations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-apple-blue-600 text-sm font-medium">
                Create Deck
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>{currentQuarter} Performance Highlights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              <strong>Strong {currentQuarter} Performance:</strong> Net income reached{" "}
              {formatCurrency(current.netIncome)}, representing a{" "}
              {calculateChange(current.netIncome, previous.netIncome).value}% increase from the previous quarter. This
              growth was primarily driven by net interest margin expansion to {current.netInterestMargin}% and
              disciplined expense management.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Key Highlights:</strong> Return on equity improved to {current.returnOnEquity}%, exceeding our
              target range, while maintaining a strong capital position with a Tier 1 ratio of{" "}
              {current.tier1CapitalRatio}%. The efficiency ratio of {current.efficiencyRatio}% demonstrates continued
              operational excellence.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI for More Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
