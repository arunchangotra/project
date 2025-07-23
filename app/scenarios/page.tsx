"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { quarterlyData, currentQuarter } from "@/lib/sample-data"

export default function ScenariosPage() {
  const [loanGrowth, setLoanGrowth] = useState(15)
  const [rateChange, setRateChange] = useState(50)
  const [depositGrowth, setDepositGrowth] = useState(10)

  const current = quarterlyData[currentQuarter as keyof typeof quarterlyData]

  const calculateScenario = () => {
    const baseLoanPortfolio = current.totalLoans
    const baseNII = current.netInterestIncome
    const baseNIM = current.netInterestMargin

    // Loan growth impact
    const newLoanPortfolio = baseLoanPortfolio * (1 + loanGrowth / 100)
    const loanGrowthImpact = (newLoanPortfolio - baseLoanPortfolio) * (baseNIM / 100) * 4 // Quarterly impact

    // Rate change impact (simplified)
    const rateImpact = (rateChange / 10000) * baseLoanPortfolio * 4 // 50 bps = 0.5%

    // New projections
    const projectedNII = baseNII + loanGrowthImpact + rateImpact
    const projectedNIM = (projectedNII / (baseLoanPortfolio + (newLoanPortfolio - baseLoanPortfolio))) * 100

    return {
      projectedNII,
      projectedNIM,
      loanGrowthImpact,
      rateImpact,
      newLoanPortfolio,
    }
  }

  const scenario = calculateScenario()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            <h1 className="text-3xl font-bold text-gray-900">What-If Scenarios</h1>
            <p className="text-gray-600">Model different scenarios and understand potential impacts</p>
          </div>
        </div>
        <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask AI
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Scenario Parameters
            </CardTitle>
            <CardDescription>Adjust the parameters below to model different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan-growth">Loan Portfolio Growth (%)</Label>
              <Input
                id="loan-growth"
                type="number"
                value={loanGrowth}
                onChange={(e) => setLoanGrowth(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Current loan portfolio: {formatCurrency(current.totalLoans)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-change">Interest Rate Change (basis points)</Label>
              <Input
                id="rate-change"
                type="number"
                value={rateChange}
                onChange={(e) => setRateChange(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Current NIM: {current.netInterestMargin}%</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit-growth">Deposit Growth (%)</Label>
              <Input
                id="deposit-growth"
                type="number"
                value={depositGrowth}
                onChange={(e) => setDepositGrowth(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Current deposits: {formatCurrency(current.totalDeposits)}</p>
            </div>

            <Button className="w-full bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate Scenario
            </Button>
          </CardContent>
        </Card>

        {/* Scenario Results */}
        <Card>
          <CardHeader>
            <CardTitle>Projected Impact</CardTitle>
            <CardDescription>Based on your scenario parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Net Interest Income</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-lg font-bold text-green-900">{formatCurrency(scenario.projectedNII)}</div>
                <div className="text-xs text-green-700">
                  +{formatCurrency(scenario.projectedNII - current.netInterestIncome)} vs current
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Net Interest Margin</span>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-blue-900">{scenario.projectedNIM.toFixed(2)}%</div>
                <div className="text-xs text-blue-700">
                  {scenario.projectedNIM > current.netInterestMargin ? "+" : ""}
                  {(scenario.projectedNIM - current.netInterestMargin).toFixed(2)}% vs current
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Impact Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Loan Growth Impact:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(scenario.loanGrowthImpact)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Rate Change Impact:</span>
                  <span className={`font-medium ${scenario.rateImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {scenario.rateImpact >= 0 ? "+" : ""}
                    {formatCurrency(scenario.rateImpact)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">New Loan Portfolio:</span>
                  <span className="font-medium">{formatCurrency(scenario.newLoanPortfolio)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
          <CardDescription>AI-powered insights on your scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Scenario Assessment</h4>
              <p className="text-sm text-blue-700">
                Your scenario projects a {loanGrowth}% loan growth with a {rateChange} basis point rate environment
                change. This would result in a net interest income increase of{" "}
                {formatCurrency(scenario.projectedNII - current.netInterestIncome)}, primarily driven by{" "}
                {scenario.loanGrowthImpact > Math.abs(scenario.rateImpact)
                  ? "loan portfolio expansion"
                  : "interest rate environment"}
                .
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Opportunities</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Significant revenue upside from loan growth</li>
                  <li>• Improved profitability metrics</li>
                  <li>• Enhanced market position</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Considerations</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Capital requirements for loan growth</li>
                  <li>• Funding cost implications</li>
                  <li>• Credit risk management</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
