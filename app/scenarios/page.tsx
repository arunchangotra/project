"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { RefreshCw, TrendingUp, TrendingDown, Filter, Check, Plus } from "lucide-react"
import { financialRatios } from "@/lib/financial-ratios" // Import all financial ratios
import { cn } from "@/lib/utils"

interface ScenarioInputs {
  loanGrowth: number
  depositRateChange: number
  provisioningChange: number
  feeGrowth: number
  costGrowth: number
}

// Use a more flexible type for results, as keys will be dynamic (matching financialRatios IDs)
type ScenarioResults = Record<string, number>

// Map internal calculation names to financialRatios IDs for consistency
const METRIC_ID_MAP = {
  netProfit: "PAT", // Using Profit After Tax (PAT) as equivalent for Net Profit
  eps: "earnings-per-share",
  nim: "NIM",
  roe: "ROE",
  roa: "ROA",
  car: "CAR",
  cet1: "CET1",
  nplr: "NPLR",
  ldr: "LDR",
  casa: "CASA",
  per: "PER",
  pbr: "PBR",
  er: "ER",
} as const

// Define the metrics that are dynamically calculated by the enhanced model
const dynamicallyCalculatedMetrics = new Set(Object.values(METRIC_ID_MAP))

export default function WhatIfScenarios() {
  const [inputs, setInputs] = useState<ScenarioInputs>({
    loanGrowth: 0,
    depositRateChange: 0,
    provisioningChange: 0,
    feeGrowth: 0,
    costGrowth: 0,
  })

  // Enhanced baseline values for more metrics, using their financialRatios IDs
  const baselineResults: ScenarioResults = {
    [METRIC_ID_MAP.netProfit]: 890, // PAT
    [METRIC_ID_MAP.eps]: 4.25, // EPS
    [METRIC_ID_MAP.nim]: 3.45, // NIM
    [METRIC_ID_MAP.roe]: 12.8, // ROE
    [METRIC_ID_MAP.roa]: 1.28, // ROA
    [METRIC_ID_MAP.car]: 14.5, // CAR
    [METRIC_ID_MAP.cet1]: 12.1, // CET1
    [METRIC_ID_MAP.nplr]: 1.8, // NPLR
    [METRIC_ID_MAP.ldr]: 85.0, // LDR
    [METRIC_ID_MAP.casa]: 42.0, // CASA
    [METRIC_ID_MAP.per]: 10.5, // PER
    [METRIC_ID_MAP.pbr]: 1.2, // PBR
    [METRIC_ID_MAP.er]: 58.2, // ER (Efficiency Ratio)
  }

  const [results, setResults] = useState<ScenarioResults>(baselineResults)

  // State to control which metrics are displayed in the result cards
  // Initialize with only 4-5 key metrics instead of all popular metrics
  const [selectedDisplayMetrics, setSelectedDisplayMetrics] = useState<Set<string>>(() => {
    // Select only 4-5 most important metrics by default
    const defaultMetrics = ["NIM", "ROE", "ROA", "CAR", "ER"] // 5 key metrics
    return new Set(defaultMetrics)
  })

  // State for showing all metrics
  const [showAllMetrics, setShowAllMetrics] = useState(false)

  // Get popular and other metrics for display
  const popularMetrics = financialRatios.filter((metric) => metric.isPopular)
  const otherMetrics = financialRatios.filter((metric) => !metric.isPopular)

  // Toggle metric selection
  const toggleMetric = (metricId: string) => {
    setSelectedDisplayMetrics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(metricId)) {
        newSet.delete(metricId)
      } else {
        newSet.add(metricId)
      }
      return newSet
    })
  }

  const calculateScenario = () => {
    // Enhanced calculation logic for multiple metrics
    const loanBookImpact = (inputs.loanGrowth / 100) * 1850 * 0.6 // 60% flow-through
    const depositCostImpact = (inputs.depositRateChange / 10000) * 15000 // 150bps on 15B deposits
    const provisionImpact = (inputs.provisioningChange / 100) * 125
    const feeImpact = (inputs.feeGrowth / 100) * 420
    const costImpact = (inputs.costGrowth / 100) * 1650

    const netProfitChange = loanBookImpact - depositCostImpact - provisionImpact + feeImpact - costImpact
    const newNetProfit = baselineResults[METRIC_ID_MAP.netProfit] + netProfitChange

    // Calculate other metrics based on the scenario inputs
    const newEps = (newNetProfit / baselineResults[METRIC_ID_MAP.netProfit]) * baselineResults[METRIC_ID_MAP.eps]
    const newNim = baselineResults[METRIC_ID_MAP.nim] + ((loanBookImpact - depositCostImpact) / 15000) * 100
    const newRoe = (newNetProfit / 6950) * 100 // Assuming 6.95B equity
    const newRoa = (newNetProfit / 69500) * 100 // Assuming 69.5B assets

    // Capital ratios - affected by loan growth and profitability
    const capitalImpact = (inputs.loanGrowth / 100) * 0.1 // Loan growth reduces capital ratios slightly
    const profitabilityBoost = ((newNetProfit - baselineResults[METRIC_ID_MAP.netProfit]) / 1000) * 0.05 // Profit retention improves capital
    const newCar = Math.max(8.0, baselineResults[METRIC_ID_MAP.car] - capitalImpact + profitabilityBoost)
    const newCet1 = Math.max(6.0, baselineResults[METRIC_ID_MAP.cet1] - capitalImpact * 0.8 + profitabilityBoost * 0.8)

    // Asset quality - affected by provisioning and loan growth
    const assetQualityImpact = (inputs.provisioningChange / 100) * 0.2 + (inputs.loanGrowth / 100) * 0.1
    const newNplr = Math.max(0.5, baselineResults[METRIC_ID_MAP.nplr] + assetQualityImpact)

    // Liquidity - affected by loan and deposit dynamics
    const liquidityImpact = (inputs.loanGrowth / 100) * 2 - (inputs.depositRateChange / 100) * 0.5
    const newLdr = Math.max(60.0, Math.min(100.0, baselineResults[METRIC_ID_MAP.ldr] + liquidityImpact))

    // CASA ratio - affected by deposit rate changes (higher rates may reduce CASA)
    const casaImpact = (inputs.depositRateChange / 100) * -0.3
    const newCasa = Math.max(25.0, Math.min(60.0, baselineResults[METRIC_ID_MAP.casa] + casaImpact))

    // Valuation metrics
    const newPer = baselineResults[METRIC_ID_MAP.per] * (baselineResults[METRIC_ID_MAP.eps] / newEps) // Inverse relationship with EPS growth
    const newPbr = baselineResults[METRIC_ID_MAP.pbr] * (newRoe / baselineResults[METRIC_ID_MAP.roe]) * 0.8 // Partial correlation with ROE

    // Efficiency ratio - affected by cost growth and revenue changes
    const revenueChange = loanBookImpact + feeImpact
    const efficiencyImpact = ((costImpact - revenueChange) / (2850 + revenueChange)) * 100 // New efficiency ratio
    const newEr = Math.max(45.0, Math.min(80.0, baselineResults[METRIC_ID_MAP.er] + efficiencyImpact))

    setResults({
      [METRIC_ID_MAP.netProfit]: Math.max(0, newNetProfit),
      [METRIC_ID_MAP.eps]: Math.max(0, newEps),
      [METRIC_ID_MAP.nim]: Math.max(0, newNim),
      [METRIC_ID_MAP.roe]: Math.max(0, newRoe),
      [METRIC_ID_MAP.roa]: Math.max(0, newRoa),
      [METRIC_ID_MAP.car]: newCar,
      [METRIC_ID_MAP.cet1]: newCet1,
      [METRIC_ID_MAP.nplr]: newNplr,
      [METRIC_ID_MAP.ldr]: newLdr,
      [METRIC_ID_MAP.casa]: newCasa,
      [METRIC_ID_MAP.per]: Math.max(5.0, newPer),
      [METRIC_ID_MAP.pbr]: Math.max(0.5, newPbr),
      [METRIC_ID_MAP.er]: newEr,
    })
  }

  useEffect(() => {
    calculateScenario()
  }, [inputs])

  const resetScenario = () => {
    setInputs({
      loanGrowth: 0,
      depositRateChange: 0,
      provisioningChange: 0,
      feeGrowth: 0,
      costGrowth: 0,
    })
    // Reset results to baseline
    setResults(baselineResults)
  }

  // Helper to get metric info and values for display
  const getMetricDisplayData = (metricId: string) => {
    const metricInfo = financialRatios.find((m) => m.id === metricId)
    if (!metricInfo) return null // Metric not found

    let baselineValue: number
    let scenarioValue: number
    let change: number
    let isDynamicallyCalculated: boolean

    if (dynamicallyCalculatedMetrics.has(metricId)) {
      baselineValue = baselineResults[metricId]
      scenarioValue = results[metricId]
      change = scenarioValue - baselineValue
      isDynamicallyCalculated = true
    } else {
      // For other metrics, use their latest historical data as both baseline and scenario
      baselineValue = metricInfo.historicalData[0]?.value || 0
      scenarioValue = baselineValue // Scenario is same as baseline for non-calculated metrics
      change = 0
      isDynamicallyCalculated = false
    }

    return {
      id: metricId,
      name: metricInfo.name,
      unit: metricInfo.unit,
      baseline: baselineValue,
      scenario: scenarioValue,
      change: change,
      isDynamicallyCalculated: isDynamicallyCalculated,
    }
  }

  // Dynamically generate comparison data for the chart based on selected display metrics
  const comparisonData = Array.from(selectedDisplayMetrics)
    .map((metricId) => {
      const data = getMetricDisplayData(metricId)
      if (!data) return null
      return {
        metric: data.name,
        baseline: data.baseline,
        scenario: data.scenario,
        unit: data.unit,
      }
    })
    .filter(Boolean) // Filter out any nulls if metricInfo is not found

  const generateAISummary = () => {
    const profitChange = results[METRIC_ID_MAP.netProfit] - baselineResults[METRIC_ID_MAP.netProfit]
    const nimChange = results[METRIC_ID_MAP.nim] - baselineResults[METRIC_ID_MAP.nim]
    const epsChange = results[METRIC_ID_MAP.eps] - baselineResults[METRIC_ID_MAP.eps]
    const roeChange = results[METRIC_ID_MAP.roe] - baselineResults[METRIC_ID_MAP.roe]

    let summary = ""

    if (Math.abs(profitChange) < 5 && Math.abs(nimChange * 100) < 5) {
      summary =
        "Minimal impact scenario: The proposed changes result in negligible impact on key financial metrics. This suggests that the current combination of levers is not sufficient to drive significant shifts in profitability or efficiency. Consider adjusting inputs more aggressively or exploring other strategic initiatives."
    } else if (profitChange > 50 && nimChange * 100 > 10) {
      summary = `Highly Favorable Scenario: This combination of inputs projects a substantial increase in Net Profit by $${profitChange.toFixed(0)}M, driven by strong loan growth and optimized deposit costs. NIM expands significantly by ${(nimChange * 100).toFixed(0)}bps, indicating enhanced lending profitability. EPS is expected to rise by $${epsChange.toFixed(2)}, and ROE improves to ${results[METRIC_ID_MAP.roe].toFixed(2)}%, signaling excellent shareholder value creation. This scenario highlights a robust growth trajectory.`
    } else if (profitChange > 20 && nimChange * 100 > 5) {
      summary = `Positive Growth Scenario: The adjustments lead to a healthy increase in Net Profit by $${profitChange.toFixed(0)}M and a notable improvement in NIM by ${(nimChange * 100).toFixed(0)}bps. This indicates effective management of both asset yields and funding costs. EPS shows a solid gain of $${epsChange.toFixed(2)}, and ROE strengthens to ${results[METRIC_ID_MAP.roe].toFixed(2)}%. This scenario suggests a favorable environment for sustained earnings.`
    } else if (profitChange > 0 || nimChange > 0) {
      summary = `Moderately Positive Scenario: The current inputs yield a positive, albeit modest, impact on profitability. Net Profit increases by $${profitChange.toFixed(0)}M, and NIM sees a slight improvement of ${(nimChange * 100).toFixed(0)}bps. While positive, further optimization of loan growth, deposit pricing, or cost management could unlock greater value. EPS and ROE also show incremental gains.`
    } else if (profitChange < -50 && nimChange * 100 < -10) {
      summary = `Severe Downturn Scenario: This scenario projects a significant decline in Net Profit by $${Math.abs(profitChange).toFixed(0)}M and a sharp contraction in NIM by ${Math.abs(nimChange * 100).toFixed(0)}bps. This could be due to aggressive deposit rate increases, substantial provisioning, or a combination of adverse factors. EPS drops by $${Math.abs(epsChange).toFixed(2)}, and ROE deteriorates to ${results[METRIC_ID_MAP.roe].toFixed(2)}%. Immediate strategic interventions would be required to mitigate these impacts.`
    } else if (profitChange < -20 && nimChange * 100 < -5) {
      summary = `Challenging Scenario: The combination of inputs results in a noticeable decrease in Net Profit by $${Math.abs(profitChange).toFixed(0)}M and a compression of NIM by ${Math.abs(nimChange * 100).toFixed(0)}bps. This suggests that rising funding costs or increased credit risk are outweighing revenue gains. EPS declines by $${Math.abs(epsChange).toFixed(2)}, and ROE weakens to ${results[METRIC_ID_MAP.roe].toFixed(2)}%. Focus on cost discipline and asset quality would be critical.`
    } else if (profitChange < 0 || nimChange < 0) {
      summary = `Moderately Negative Scenario: The current adjustments lead to a slight decrease in Net Profit by $${Math.abs(profitChange).toFixed(0)}M and a minor compression in NIM by ${Math.abs(nimChange * 100).toFixed(0)}bps. While not severe, this trend warrants attention. Reviewing the impact of individual levers, especially deposit rates and operating costs, could help reverse this trajectory. EPS and ROE also show minor declines.`
    } else {
      summary =
        "The scenario results are currently at baseline or show no significant change. Adjust the sliders to explore different financial outcomes."
    }

    return summary
  }

  // Helper to format values for display
  const formatDisplayValue = (value: number, unit: string) => {
    if (unit === "$M") return `$${value.toFixed(0)}M`
    if (unit === "$") return `$${value.toFixed(2)}`
    if (unit === "%") return `${value.toFixed(2)}%`
    if (unit === "x") return `${value.toFixed(2)}x`
    return value.toFixed(2)
  }

  // Helper to format change values for display
  const formatDisplayChange = (change: number, unit: string, metricId: string) => {
    const sign = change > 0 ? "+" : ""
    if (metricId === METRIC_ID_MAP.nim) return `${sign}${(change * 100).toFixed(0)}bps` // NIM is in bps
    if (unit === "$M") return `${sign}$${Math.abs(change).toFixed(0)}M`
    if (unit === "$") return `$${Math.abs(change).toFixed(2)}`
    if (unit === "%") return `${sign}${change.toFixed(1)}%`
    if (unit === "x") return `${sign}${change.toFixed(2)}x`
    return `${sign}${change.toFixed(2)}`
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">What-If Scenario Builder</h1>
          <p className="text-lg text-gray-600 mt-1">Simulate impact of business levers on Q3 2024 performance</p>
        </div>
        <Button
          variant="outline"
          onClick={resetScenario}
          className="flex items-center space-x-2 rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Metric Selection Cards */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
            <Filter className="h-5 w-5 text-apple-blue-600" />
            <span>Select Metrics to Analyze</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose which metrics to display in the results and comparison chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* First row - always visible popular metrics */}
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-2">
              {popularMetrics.map((metric) => (
                <Card
                  key={metric.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                    selectedDisplayMetrics.has(metric.id)
                      ? "border-apple-blue-600 bg-apple-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  onClick={() => toggleMetric(metric.id)}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-gray-800 leading-tight truncate">{metric.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{metric.category}</p>
                      </div>
                      {selectedDisplayMetrics.has(metric.id) && (
                        <Check className="h-3 w-3 text-apple-blue-600 flex-shrink-0 ml-1" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatDisplayValue(results[metric.id] || metric.historicalData[0]?.value || 0, metric.unit)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second row - additional metrics, shown when expanded */}
            {showAllMetrics && (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-2">
                {otherMetrics.map((metric) => (
                  <Card
                    key={metric.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                      selectedDisplayMetrics.has(metric.id)
                        ? "border-apple-blue-600 bg-apple-blue-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => toggleMetric(metric.id)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-xs text-gray-800 leading-tight truncate">{metric.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{metric.category}</p>
                        </div>
                        {selectedDisplayMetrics.has(metric.id) && (
                          <Check className="h-3 w-3 text-apple-blue-600 flex-shrink-0 ml-1" />
                        )}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatDisplayValue(results[metric.id] || metric.historicalData[0]?.value || 0, metric.unit)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Show More/Less button */}
            {otherMetrics.length > 0 && (
              <div className="flex justify-center pt-2">
                {!showAllMetrics ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllMetrics(true)}
                    className="border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Show {otherMetrics.length} More Metrics
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllMetrics(false)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Show Less
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <Card className="shadow-lg rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Scenario Inputs</CardTitle>
            <CardDescription className="text-gray-600">Adjust key business levers to see impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Loan Growth (%)</Label>
              <div className="px-3">
                <Slider
                  value={[inputs.loanGrowth]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, loanGrowth: value[0] }))}
                  max={20}
                  min={-10}
                  step={1}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-apple-blue-200 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-apple-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>-10%</span>
                <span className="font-medium text-gray-800">{inputs.loanGrowth}%</span>
                <span>+20%</span>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Deposit Rate Change (bps)</Label>
              <div className="px-3">
                <Slider
                  value={[inputs.depositRateChange]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, depositRateChange: value[0] }))}
                  max={100}
                  min={-50}
                  step={5}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-apple-blue-200 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-apple-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>-50bps</span>
                <span className="font-medium text-gray-800">{inputs.depositRateChange}bps</span>
                <span>+100bps</span>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Provisioning Change (%)</Label>
              <div className="px-3">
                <Slider
                  value={[inputs.provisioningChange]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, provisioningChange: value[0] }))}
                  max={50}
                  min={-25}
                  step={5}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-apple-blue-200 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-apple-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>-25%</span>
                <span className="font-medium text-gray-800">{inputs.provisioningChange}%</span>
                <span>+50%</span>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Fee Income Growth (%)</Label>
              <div className="px-3">
                <Slider
                  value={[inputs.feeGrowth]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, feeGrowth: value[0] }))}
                  max={15}
                  min={-15}
                  step={1}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-apple-blue-200 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-apple-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>-15%</span>
                <span className="font-medium text-gray-800">{inputs.feeGrowth}%</span>
                <span>+15%</span>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Operating Cost Growth (%)</Label>
              <div className="px-3">
                <Slider
                  value={[inputs.costGrowth]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, costGrowth: value[0] }))}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-apple-blue-200 [&>span:first-child]:rounded-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-apple-blue-600 [&_[role=slider]]:border-none [&_[role=slider]]:shadow-md"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>-10%</span>
                <span className="font-medium text-gray-800">{inputs.costGrowth}%</span>
                <span>+10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-lg rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Scenario Results</CardTitle>
            <CardDescription className="text-gray-600">Impact on selected financial metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {Array.from(selectedDisplayMetrics).map((metricId) => {
                const data = getMetricDisplayData(metricId)
                if (!data) return null

                const isPositive = data.change > 0
                const isNegative = data.change < 0

                return (
                  <div key={data.id} className="space-y-2">
                    <div className="text-sm text-gray-600">{data.name}</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatDisplayValue(data.scenario, data.unit)}
                    </div>
                    {data.isDynamicallyCalculated && (
                      <div
                        className={`text-sm flex items-center space-x-1 ${
                          isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {data.change !== 0 &&
                          (isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
                        <span>{formatDisplayChange(data.change, data.unit, data.id)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <ChartContainer
              config={{
                baseline: { label: "Baseline", color: "hsl(var(--chart-1))" },
                scenario: { label: "Scenario", color: "hsl(var(--chart-2))" },
              }}
              className={`min-h-[200px] h-[${Math.max(200, selectedDisplayMetrics.size * 50 + 100)}px]`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="metric"
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="baseline" fill="var(--color-baseline)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scenario" fill="var(--color-scenario)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">AI Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{generateAISummary()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
