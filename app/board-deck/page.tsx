"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { quarterlyData, currentQuarter } from "@/lib/sample-data"

export default function BoardDeckPage() {
  const current = quarterlyData[currentQuarter as keyof typeof quarterlyData]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Board Deck</h1>
            <p className="text-gray-600">{currentQuarter} Executive Summary</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>{currentQuarter} Financial Performance Highlights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Financial Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Income:</span>
                  <span className="font-semibold">{formatCurrency(current.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-semibold">{formatCurrency(current.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROE:</span>
                  <span className="font-semibold">{current.returnOnEquity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIM:</span>
                  <span className="font-semibold">{current.netInterestMargin}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Strong {currentQuarter} performance with net income of {formatCurrency(current.netIncome)}, representing
                solid growth driven by improved net interest margin and disciplined expense management. Return on equity
                reached {current.returnOnEquity}%, exceeding our target range.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Key Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Net Interest Margin Expansion</p>
                  <p className="text-sm text-gray-600">NIM improved to {current.netInterestMargin}% (+7 bps QoQ)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Strong Profitability</p>
                  <p className="text-sm text-gray-600">ROE of {current.returnOnEquity}% exceeds peer median</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Operational Efficiency</p>
                  <p className="text-sm text-gray-600">Efficiency ratio improved to {current.efficiencyRatio}%</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Capital Strength</p>
                  <p className="text-sm text-gray-600">
                    Tier 1 ratio of {current.tier1CapitalRatio}% well above regulatory requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Areas of Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            Areas of Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Credit Provision Trend</p>
                <p className="text-sm text-gray-600">
                  Loan loss provisions increased to {formatCurrency(current.loanLossProvisions)} - monitoring credit
                  quality closely
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Deposit Competition</p>
                <p className="text-sm text-gray-600">
                  Rising funding costs in competitive environment - need strategic deposit retention initiatives
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Regulatory Environment</p>
                <p className="text-sm text-gray-600">
                  Preparing for potential changes in capital requirements and stress testing protocols
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Priorities - Q4 2024</CardTitle>
          <CardDescription>Key focus areas for the remainder of the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Revenue Optimization</h4>
                <p className="text-sm text-gray-600">
                  Maintain NIM discipline while growing core deposits and optimizing loan portfolio mix for
                  risk-adjusted returns
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Operational Excellence</h4>
                <p className="text-sm text-gray-600">
                  Continue efficiency initiatives targeting sub-58% efficiency ratio through automation and process
                  optimization
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Risk Management</h4>
                <p className="text-sm text-gray-600">
                  Strengthen capital position and enhance credit monitoring capabilities ahead of potential economic
                  headwinds
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">4. Digital Transformation</h4>
                <p className="text-sm text-gray-600">
                  Accelerate digital banking initiatives to improve customer experience and reduce operational costs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outlook */}
      <Card>
        <CardHeader>
          <CardTitle>Outlook</CardTitle>
          <CardDescription>Management perspective on future performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-apple-blue-50 border border-apple-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Cautiously optimistic</strong> for Q4 2024 performance with continued focus on sustainable growth
              and risk management. We expect to maintain strong profitability metrics while navigating the evolving
              interest rate environment and competitive landscape. Our robust capital position provides flexibility to
              pursue strategic opportunities while maintaining prudent risk management practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
