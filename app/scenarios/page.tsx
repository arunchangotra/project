"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Filter,
  Check,
  Plus,
  MessageSquare,
  Settings,
  Calendar,
  Building2,
  ChevronDown,
} from "lucide-react"
import { financialRatios } from "@/lib/financial-ratios"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ScenarioInputs {
  loanGrowth: number
  depositRateChange: number
  provisioningChange: number
  feeGrowth: number
  costGrowth: number
}

type ScenarioResults = Record<string, number>

// Bank filter options based on CSV data
const bankFilterOptions = [
  { value: "ADIB", label: "ADIB", color: "bg-blue-600" },
  { value: "FAB", label: "FAB", color: "bg-green-600" },
  { value: "ENBD", label: "ENBD", color: "bg-purple-600" },
  { value: "CBD", label: "CBD", color: "bg-orange-600" },
  { value: "RAKBANK", label: "RAKBANK", color: "bg-red-600" },
  { value: "MASHREQ", label: "MASHREQ", color: "bg-indigo-600" },
]

// Category filter options based on CSV
const categoryFilterOptions = [
  { value: "P&L", label: "P&L Items", count: 89 },
  { value: "KPI", label: "Key Performance Indicators", count: 67 },
  { value: "Balance Sheet", label: "Balance Sheet", count: 45 },
  { value: "Ratios", label: "Financial Ratios", count: 34 },
  { value: "Risk", label: "Risk Metrics", count: 23 },
]

// Period filter options based on CSV
const periodFilterOptions = [
  { value: "fy_2024", label: "FY 2024", type: "annual" },
  { value: "fy_2023", label: "FY 2023", type: "annual" },
  { value: "9m_2024", label: "9M 2024", type: "nine_months" },
  { value: "9m_2023", label: "9M 2023", type: "nine_months" },
  { value: "h1_2024", label: "H1 2024", type: "half_yearly" },
  { value: "h1_2023", label: "H1 2023", type: "half_yearly" },
  { value: "jas_2024", label: "Q3 2024", type: "quarterly" },
  { value: "amj_2024", label: "Q2 2024", type: "quarterly" },
  { value: "jfm_2024", label: "Q1 2024", type: "quarterly" },
]

// Segment filter options
const segmentFilterOptions = [
  { value: "consolidated", label: "Consolidated" },
  { value: "corporate", label: "Corporate Banking" },
  { value: "retail", label: "Retail Banking" },
  { value: "investment", label: "Investment Banking" },
  { value: "treasury", label: "Treasury" },
  { value: "islamic", label: "Islamic Banking" },
]

// Map internal calculation names to financialRatios IDs for consistency
const METRIC_ID_MAP = {
  netProfit: "PAT",
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

const dynamicallyCalculatedMetrics = new Set(Object.values(METRIC_ID_MAP))

export default function WhatIfScenarios() {
  const [inputs, setInputs] = useState<ScenarioInputs>({
    loanGrowth: 0,
    depositRateChange: 0,
    provisioningChange: 0,
    feeGrowth: 0,
    costGrowth: 0,
  })

  // Filter states
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["ADIB"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["P&L", "KPI"])
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(["jas_2024"])
  const [selectedSegments, setSelectedSegments] = useState<string[]>(["consolidated"])

  // Filter dropdown states
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false)
  const [periodFilterOpen, setPeriodFilterOpen] = useState(false)
  const [segmentFilterOpen, setSegmentFilterOpen] = useState(false)

  // Enhanced baseline values for more metrics, using their financialRatios IDs
  const baselineResults: ScenarioResults = {
    [METRIC_ID_MAP.netProfit]: 890,
    [METRIC_ID_MAP.eps]: 4.25,
    [METRIC_ID_MAP.nim]: 3.45,
    [METRIC_ID_MAP.roe]: 12.8,
    [METRIC_ID_MAP.roa]: 1.28,
    [METRIC_ID_MAP.car]: 14.5,
    [METRIC_ID_MAP.cet1]: 12.1,
    [METRIC_ID_MAP.nplr]: 1.8,
    [METRIC_ID_MAP.ldr]: 85.0,
    [METRIC_ID_MAP.casa]: 42.0,
    [METRIC_ID_MAP.per]: 10.5,
    [METRIC_ID_MAP.pbr]: 1.2,
    [METRIC_ID_MAP.er]: 58.2,
  }

  const [results, setResults] = useState<ScenarioResults>(baselineResults)

  const [selectedDisplayMetrics, setSelectedDisplayMetrics] = useState<Set<string>>(() => {
    const defaultMetrics = ["NIM", "ROE", "ROA"]
    return new Set(defaultMetrics)
  })

  const [showAllMetrics, setShowAllMetrics] = useState(false)

  // Filter toggle functions
  const toggleBank = (bankValue: string) => {
    const newSelection = selectedBanks.includes(bankValue)
      ? selectedBanks.filter((b) => b !== bankValue)
      : [...selectedBanks, bankValue]
    setSelectedBanks(newSelection)
  }

  const toggleCategory = (categoryValue: string) => {
    const newSelection = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((c) => c !== categoryValue)
      : [...selectedCategories, categoryValue]
    setSelectedCategories(newSelection)
  }

  const togglePeriod = (periodValue: string) => {
    const newSelection = selectedPeriods.includes(periodValue)
      ? selectedPeriods.filter((p) => p !== periodValue)
      : [...selectedPeriods, periodValue]
    setSelectedPeriods(newSelection)
  }

  const toggleSegment = (segmentValue: string) => {
    const newSelection = selectedSegments.includes(segmentValue)
      ? selectedSegments.filter((s) => s !== segmentValue)
      : [...selectedSegments, segmentValue]
    setSelectedSegments(newSelection)
  }

  const clearAllFilters = () => {
    setSelectedBanks(["ADIB"])
    setSelectedCategories(["P&L", "KPI"])
    setSelectedPeriods(["jas_2024"])
    setSelectedSegments(["consolidated"])
  }

  const getPopularMetrics = () => financialRatios.filter((metric) => metric.isPopular)
  const getOtherMetrics = () => financialRatios.filter((metric) => !metric.isPopular)

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
    const loanBookImpact = (inputs.loanGrowth / 100) * 1850 * 0.6
    const depositCostImpact = (inputs.depositRateChange / 10000) * 15000
    const provisionImpact = (inputs.provisioningChange / 100) * 125
    const feeImpact = (inputs.feeGrowth / 100) * 420
    const costImpact = (inputs.costGrowth / 100) * 1650

    const netProfitChange = loanBookImpact - depositCostImpact - provisionImpact + feeImpact - costImpact
    const newNetProfit = baselineResults[METRIC_ID_MAP.netProfit] + netProfitChange

    const newEps = (newNetProfit / baselineResults[METRIC_ID_MAP.netProfit]) * baselineResults[METRIC_ID_MAP.eps]
    const newNim = baselineResults[METRIC_ID_MAP.nim] + ((loanBookImpact - depositCostImpact) / 15000) * 100
    const newRoe = (newNetProfit / 6950) * 100
    const newRoa = (newNetProfit / 69500) * 100

    const capitalImpact = (inputs.loanGrowth / 100) * 0.1
    const profitabilityBoost = ((newNetProfit - baselineResults[METRIC_ID_MAP.netProfit]) / 1000) * 0.05
    const newCar = Math.max(8.0, baselineResults[METRIC_ID_MAP.car] - capitalImpact + profitabilityBoost)
    const newCet1 = Math.max(6.0, baselineResults[METRIC_ID_MAP.cet1] - capitalImpact * 0.8 + profitabilityBoost * 0.8)

    const assetQualityImpact = (inputs.provisioningChange / 100) * 0.2 + (inputs.loanGrowth / 100) * 0.1
    const newNplr = Math.max(0.5, baselineResults[METRIC_ID_MAP.nplr] + assetQualityImpact)

    const liquidityImpact = (inputs.loanGrowth / 100) * 2 - (inputs.depositRateChange / 100) * 0.5
    const newLdr = Math.max(60.0, Math.min(100.0, baselineResults[METRIC_ID_MAP.ldr] + liquidityImpact))

    const casaImpact = (inputs.depositRateChange / 100) * -0.3
    const newCasa = Math.max(25.0, Math.min(60.0, baselineResults[METRIC_ID_MAP.casa] + casaImpact))

    const newPer = baselineResults[METRIC_ID_MAP.per] * (baselineResults[METRIC_ID_MAP.eps] / newEps)
    const newPbr = baselineResults[METRIC_ID_MAP.pbr] * (newRoe / baselineResults[METRIC_ID_MAP.roe]) * 0.8

    const revenueChange = loanBookImpact + feeImpact
    const efficiencyImpact = ((costImpact - revenueChange) / (2850 + revenueChange)) * 100
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
    setResults(baselineResults)
  }

  const getMetricDisplayData = (metricId: string) => {
    const metricInfo = financialRatios.find((m) => m.id === metricId)
    if (!metricInfo) return null

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
      baselineValue = metricInfo.historicalData[0]?.value || 0
      scenarioValue = baselineValue
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

  const getShortMetricName = (fullName: string) => {
    const shortNames: Record<string, string> = {
      "Net Interest Margin (NIM)": "NIM",
      "Return on Equity (ROE)": "ROE",
      "Return on Assets (ROA)": "ROA",
      "Capital Adequacy Ratio (CAR)": "CAR",
      "Common Equity Tier 1 (CET1) Ratio": "CET1",
      "Non-Performing Loan (NPL) Ratio": "NPL Ratio",
      "Loan-to-Deposit Ratio (LDR)": "LDR",
      "CASA Ratio": "CASA",
      "P/E Ratio": "P/E",
      "P/B Ratio": "P/B",
      "Efficiency Ratio": "Efficiency",
      "Adjusted Tangible Common Equity/Assets": "ATCE",
      "Net Charge-Off Ratio": "NCO Ratio",
      "Provision Coverage Ratio (PCR)": "PCR",
    }
    return shortNames[fullName] || fullName
  }

  const comparisonData = Array.from(selectedDisplayMetrics)
    .map((metricId) => {
      const data = getMetricDisplayData(metricId)
      if (!data) return null
      return {
        metric: getShortMetricName(data.name),
        baseline: data.baseline,
        scenario: data.scenario,
        unit: data.unit,
      }
    })
    .filter(Boolean)

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

  const formatDisplayValue = (value: number, unit: string) => {
    if (unit === "$M") return `$${value.toFixed(0)}M`
    if (unit === "$") return `$${value.toFixed(2)}`
    if (unit === "%") return `${value.toFixed(2)}%`
    if (unit === "x") return `${value.toFixed(2)}x`
    return value.toFixed(2)
  }

  const formatDisplayChange = (change: number, unit: string, metricId: string) => {
    const sign = change > 0 ? "+" : ""
    if (metricId === METRIC_ID_MAP.nim) return `${sign}${(change * 100).toFixed(0)}bps`
    if (unit === "$M") return `${sign}$${Math.abs(change).toFixed(0)}M`
    if (unit === "$") return `$${Math.abs(change).toFixed(2)}`
    if (unit === "%") return `${sign}${change.toFixed(1)}%`
    if (unit === "x") return `${sign}${change.toFixed(2)}x`
    return `${sign}${change.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">What-If Scenario Builder</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Simulate impact of business levers on Q3 2024 performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 bg-transparent px-6 py-2"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI about scenarios
              </Button>
              <Button
                variant="outline"
                onClick={resetScenario}
                className="flex items-center space-x-2 rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent px-6 py-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent px-6 py-2"
              >
                <Link href="/">Back to Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Global Filters Section */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-apple-blue-600" />
                  <CardTitle className="text-xl font-semibold text-gray-800">Scenario Filters</CardTitle>
                  <Badge variant="secondary" className="bg-apple-blue-100 text-apple-blue-700 text-xs px-2 py-1">
                    Global Filter
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear All
                </Button>
              </div>
              <CardDescription className="text-gray-600">
                Filter scenario analysis by bank, category, period, and segment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filter Buttons Row */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-amber-900 hover:bg-amber-800 text-white h-9 px-4 text-sm font-medium"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Category
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4" align="start">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-900">Select Categories</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categoryFilterOptions.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.value}
                              checked={selectedCategories.includes(category.value)}
                              onCheckedChange={() => toggleCategory(category.value)}
                              className="h-4 w-4"
                            />
                            <label htmlFor={category.value} className="text-sm text-gray-700 cursor-pointer flex-1">
                              {category.label}
                              <span className="text-gray-500 ml-1">({category.count})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Period Filter */}
                <Popover open={periodFilterOpen} onOpenChange={setPeriodFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-amber-900 hover:bg-amber-800 text-white h-9 px-4 text-sm font-medium"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Period Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-4" align="start">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-900">Time Periods</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {periodFilterOptions.map((period) => (
                          <div key={period.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={period.value}
                              checked={selectedPeriods.includes(period.value)}
                              onCheckedChange={() => togglePeriod(period.value)}
                              className="h-4 w-4"
                            />
                            <label htmlFor={period.value} className="text-sm text-gray-700 cursor-pointer flex-1">
                              {period.label}
                              <Badge variant="outline" className="ml-2 text-xs px-1 py-0 h-4">
                                {period.type}
                              </Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Segment Filter */}
                <Popover open={segmentFilterOpen} onOpenChange={setSegmentFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-amber-900 hover:bg-amber-800 text-white h-9 px-4 text-sm font-medium"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Segment
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-4" align="start">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-900">Business Segments</h4>
                      <div className="space-y-2">
                        {segmentFilterOptions.map((segment) => (
                          <div key={segment.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={segment.value}
                              checked={selectedSegments.includes(segment.value)}
                              onCheckedChange={() => toggleSegment(segment.value)}
                              className="h-4 w-4"
                            />
                            <label htmlFor={segment.value} className="text-sm text-gray-700 cursor-pointer flex-1">
                              {segment.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Bank Selection Buttons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Select Banks for Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {bankFilterOptions.map((bank) => (
                    <Button
                      key={bank.value}
                      variant={selectedBanks.includes(bank.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleBank(bank.value)}
                      className={cn(
                        "h-9 px-4 text-sm font-medium transition-all",
                        selectedBanks.includes(bank.value)
                          ? `${bank.color} text-white hover:opacity-90`
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {bank.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Active Filters Summary</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedBanks.length +
                      selectedCategories.length +
                      selectedPeriods.length +
                      selectedSegments.length}{" "}
                    filters
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs text-gray-600">
                    <strong>Banks:</strong> {selectedBanks.join(", ") || "None"}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Categories:</strong> {selectedCategories.join(", ") || "None"}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Periods:</strong>{" "}
                    {selectedPeriods.map((p) => periodFilterOptions.find((opt) => opt.value === p)?.label).join(", ") ||
                      "None"}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Segments:</strong> {selectedSegments.join(", ") || "None"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metric Selection Cards */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                <Filter className="h-5 w-5 text-apple-blue-600" />
                <span>Select Metrics to Analyze</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Choose which metrics to display in the results and comparison chart
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
                  {getPopularMetrics().map((metric) => (
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
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-xs text-gray-800 leading-tight truncate">
                              {metric.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate mt-1">{metric.category}</p>
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

                {showAllMetrics && (
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
                    {getOtherMetrics().map((metric) => (
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
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-xs text-gray-800 leading-tight truncate">
                                {metric.name}
                              </h3>
                              <p className="text-xs text-gray-500 truncate mt-1">{metric.category}</p>
                            </div>
                            {selectedDisplayMetrics.has(metric.id) && (
                              <Check className="h-3 w-3 text-apple-blue-600 flex-shrink-0 ml-1" />
                            )}
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatDisplayValue(
                              results[metric.id] || metric.historicalData[0]?.value || 0,
                              metric.unit,
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {getOtherMetrics().length > 0 && (
                  <div className="flex justify-center pt-4">
                    {!showAllMetrics ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllMetrics(true)}
                        className="border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Show {getOtherMetrics().length} More Metrics
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllMetrics(false)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
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
            <Card className="shadow-lg rounded-xl border-none bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-800">Scenario Inputs</CardTitle>
                <CardDescription className="text-gray-600">Adjust key business levers to see impact</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium text-base">Loan Growth (%)</Label>
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
                  <div className="flex justify-between text-sm text-gray-500 px-3">
                    <span>-10%</span>
                    <span className="font-medium text-gray-800 text-base">{inputs.loanGrowth}%</span>
                    <span>+20%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium text-base">Deposit Rate Change (bps)</Label>
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
                  <div className="flex justify-between text-sm text-gray-500 px-3">
                    <span>-50bps</span>
                    <span className="font-medium text-gray-800 text-base">{inputs.depositRateChange}bps</span>
                    <span>+100bps</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium text-base">Provisioning Change (%)</Label>
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
                  <div className="flex justify-between text-sm text-gray-500 px-3">
                    <span>-25%</span>
                    <span className="font-medium text-gray-800 text-base">{inputs.provisioningChange}%</span>
                    <span>+50%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium text-base">Fee Income Growth (%)</Label>
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
                  <div className="flex justify-between text-sm text-gray-500 px-3">
                    <span>-15%</span>
                    <span className="font-medium text-gray-800 text-base">{inputs.feeGrowth}%</span>
                    <span>+15%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium text-base">Operating Cost Growth (%)</Label>
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
                  <div className="flex justify-between text-sm text-gray-500 px-3">
                    <span>-10%</span>
                    <span className="font-medium text-gray-800 text-base">{inputs.costGrowth}%</span>
                    <span>+10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="shadow-lg rounded-xl border-none bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-800">Scenario Results</CardTitle>
                <CardDescription className="text-gray-600">Impact on selected financial metrics</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {Array.from(selectedDisplayMetrics).map((metricId) => {
                    const data = getMetricDisplayData(metricId)
                    if (!data) return null

                    const isPositive = data.change > 0
                    const isNegative = data.change < 0

                    return (
                      <div key={data.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 font-medium">{data.name}</div>
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
                            <span className="font-medium">{formatDisplayChange(data.change, data.unit, data.id)}</span>
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
                  className={`min-h-[200px] h-[${Math.max(200, selectedDisplayMetrics.size * 50 + 100)}px] w-full`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="metric"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tickLine={false} axisLine={false} width={60} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="baseline" fill="var(--color-baseline)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                      <Bar dataKey="scenario" fill="var(--color-scenario)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-800">AI Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <p className="text-gray-700 leading-relaxed text-base">{generateAISummary()}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
