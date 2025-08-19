"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { detailedVarianceData, type LineItem } from "@/lib/sample-data"
import { financialRatios } from "@/lib/financial-ratios"
import { TrendingUp, TrendingDown, Filter, ChevronDown, Check, Plus, MessageSquare, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useMemo, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelectDropdown } from "@/components/multi-select-dropdown"
import { metricOptions, categoryFilters, bankFilters, periodFilters } from "@/lib/filter-options"

// Helper function to format currency
const formatCurrency = (value: number) => `$${Math.abs(value)}M`
// Helper function to format percentage change
const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`

// Helper function to format metric values
const formatValue = (value: number, unit: string) => {
  if (unit === "%") return `${value.toFixed(2)}%`
  if (unit === "x") return `${value.toFixed(2)}x`
  if (unit === "$M") return `$${value.toFixed(0)}M`
  if (unit === "$") return `$${value.toFixed(2)}`
  return value.toFixed(2)
}

// Helper function to format metric change
const formatChange = (value: number, unit: string) => {
  const sign = value > 0 ? "+" : ""
  if (unit === "%") return `${sign}${value.toFixed(1)}%`
  if (unit === "x") return `${sign}${value.toFixed(2)}x`
  if (unit === "$M") return `${sign}$${value.toFixed(0)}M`
  if (unit === "$") return `${sign}$${value.toFixed(2)}`
  return `${sign}${value.toFixed(1)}`
}

// Helper function to calculate aggregates for parent line items
const calculateAggregates = (data: LineItem[]): LineItem[] => {
  const processedData: LineItem[] = JSON.parse(JSON.stringify(data)) // Deep copy

  // Map to store items by their numerical prefix for easier lookup
  processedData.forEach((item) => {
    const match = item.category.match(/^(\d+(\.\d+)*[a-z]?)/) // Regex to extract numerical prefix like "1", "1.1", "1.1.1a"
    if (match) {
      item._prefix = match[1] // Store the prefix on the item for easier access
    }
  })

  // Function to get direct children of an item based on numerical prefix
  const getChildren = (parentItem: LineItem): LineItem[] => {
    if (!parentItem._prefix) return []

    const children: LineItem[] = []
    processedData.forEach((child) => {
      if (child.level === parentItem.level + 1 && child._prefix) {
        // Check if child's prefix starts with parent's prefix followed by a dot
        // And ensure it's a direct child (e.g., "1.1" is child of "1", but "1.1.1" is not direct child of "1")
        if (child._prefix.startsWith(parentItem._prefix + ".")) {
          const remaining = child._prefix.substring(parentItem._prefix.length + 1)
          // Check if 'remaining' only contains one segment (e.g., "1", "2a", not "1.1")
          if (!remaining.includes(".")) {
            children.push(child)
          }
        }
      }
    })
    return children
  }

  // Process from lowest level parents (level 1) up to highest (level 0)
  for (let level = 1; level >= 0; level--) {
    processedData.forEach((item) => {
      if (item.level === level) {
        // Only aggregate if current and previous are NOT already set (i.e., not hardcoded)
        if (item.current === undefined && item.previous === undefined) {
          const children = getChildren(item)
          if (children.length > 0) {
            let currentSum = 0
            let previousSum = 0
            let hasNumericalChildren = false

            children.forEach((child) => {
              // Only sum if the child itself has numerical values (i.e., it's a leaf or already aggregated)
              if (child.current !== undefined && child.previous !== undefined) {
                currentSum += child.current
                previousSum += child.previous
                hasNumericalChildren = true
              }
            })

            if (hasNumericalChildren) {
              item.current = currentSum
              item.previous = previousSum
              item.variance = currentSum - previousSum
              item.variancePercent = previousSum !== 0 ? (item.variance / previousSum) * 100 : 0
            }
          }
        }
      }
    })
  }

  // Post-processing for derived top-level items (PBT, PAT)
  const operatingIncome = processedData.find((item) => item.id === "operating-income")
  const operatingExpenses = processedData.find((item) => item.id === "operating-expenses")
  const impairmentCharges = processedData.find((item) => item.id === "impairment-charges")

  const pbtItem = processedData.find((item) => item.id === "profit-before-tax")
  if (
    pbtItem &&
    operatingIncome?.current !== undefined &&
    operatingExpenses?.current !== undefined &&
    impairmentCharges?.current !== undefined
  ) {
    pbtItem.current = operatingIncome.current - operatingExpenses.current - impairmentCharges.current
    pbtItem.previous =
      (operatingIncome.previous ?? 0) - (operatingExpenses.previous ?? 0) - (impairmentCharges.previous ?? 0)
    pbtItem.variance = pbtItem.current - pbtItem.previous
    pbtItem.variancePercent = pbtItem.previous !== 0 ? (pbtItem.variance / pbtItem.previous) * 100 : 0
  }

  return processedData
}

const formatPeriodLabel = (period: string) => {
  if (period.includes("jfm")) return `Q1 ${period.split("_")[1]}`
  if (period.includes("amj")) return `Q2 ${period.split("_")[1]}`
  if (period.includes("jas")) return `Q3 ${period.split("_")[1]}`
  if (period.includes("ond")) return `Q4 ${period.split("_")[1]}`
  if (period.includes("h1")) return `H1 ${period.split("_")[1]}`
  if (period.includes("h2")) return `H2 ${period.split("_")[1]}`
  if (period.includes("9m")) return `9M ${period.split("_")[1]}`
  if (period.includes("fy")) return `FY ${period.split("_")[1]}`
  return period
}

export default function VarianceAnalysis() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Track if we've already processed the initial URL parameter
  const hasProcessedInitialUrl = useRef(false)

  // Filter states
  const [selectedPeriodType, setSelectedPeriodType] = useState("quarterly")
  const [selectedCurrentPeriod, setSelectedCurrentPeriod] = useState("jas_2024")
  const [selectedPreviousPeriod, setSelectedPreviousPeriod] = useState("amj_2024")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "net_interest_income",
    "operating_income",
    "net_profit",
  ])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["P&L"])
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["ADIB"])

  // Multiple metrics selection state for charts - this will be filtered based on above filters
  const [selectedMetricsForChart, setSelectedMetricsForChart] = useState<Set<string>>(() => {
    const metricId = searchParams.get("metricId")
    if (metricId) {
      hasProcessedInitialUrl.current = true
      return new Set([metricId])
    }
    return new Set(["NIM", "ROA"])
  })

  // Filter financial ratios based on selected categories and metrics
  const filteredFinancialRatios = useMemo(() => {
    let filtered = financialRatios

    // Filter by selected categories if any are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ratio) =>
        selectedCategories.some((category) => {
          // Map filter categories to metric categories
          if (category === "P&L") return ["Profitability", "Efficiency"].includes(ratio.category)
          if (category === "KPI") return ["Profitability", "Efficiency", "Valuation"].includes(ratio.category)
          if (category === "Balance Sheet")
            return ["Capital Adequacy", "Liquidity", "Leverage & Capital Adequacy"].includes(ratio.category)
          if (category === "Ratios") return ["Asset Quality", "Liquidity", "Valuation"].includes(ratio.category)
          if (category === "Risk") return ["Asset Quality", "Market Risk"].includes(ratio.category)
          return false
        }),
      )
    }

    // Filter by selected metrics if any are selected
    if (selectedMetrics.length > 0) {
      filtered = filtered.filter((ratio) => {
        // Map metric options to ratio IDs
        const metricToRatioMap: Record<string, string[]> = {
          net_interest_income: ["NIM"],
          operating_income: ["NIM", "ER"],
          net_profit: ["ROE", "ROA", "PER"],
          nim: ["NIM"],
          roe: ["ROE"],
          roa: ["ROA"],
          cost_to_income: ["ER"],
          capital_adequacy: ["CAR", "CET1"],
          tier1_ratio: ["CET1"],
          npl_ratio: ["NPLR"],
          eps: ["PER"],
          loan_growth: ["LDR"],
          deposit_growth: ["LDR", "CASA"],
        }

        return selectedMetrics.some((metric) => metricToRatioMap[metric]?.includes(ratio.id) || false)
      })
    }

    return filtered
  }, [selectedCategories, selectedMetrics])

  // Get popular and other metrics from filtered results
  const popularMetrics = filteredFinancialRatios.filter((metric) => metric.isPopular)
  const otherMetrics = filteredFinancialRatios.filter((metric) => !metric.isPopular)
  const displayedMetrics = popularMetrics

  // Toggle metric selection for charts
  const toggleMetric = (metricId: string) => {
    setSelectedMetricsForChart((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(metricId)) {
        newSet.delete(metricId)
      } else {
        newSet.add(metricId)
      }
      return newSet
    })
  }

  // Update the chart selection to only show filtered metrics
  const selectedMetricsData = Array.from(selectedMetricsForChart)
    .map((id) => filteredFinancialRatios.find((m) => m.id === id))
    .filter(Boolean)

  // Calculate aggregates for line items
  const aggregatedData = useMemo(() => calculateAggregates(detailedVarianceData), [])

  // Initialize expandedRows: all rows are collapsed by default
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set<string>())

  // Function to toggle expansion of a row
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // State to show all metrics
  const [showAllMetrics, setShowAllMetrics] = useState(false)

  // Prepare chart data for multiple metrics
  const chartData = useMemo(() => {
    if (selectedMetricsData.length === 0) return []

    // Get all quarters from the first metric (they should all have the same quarters)
    const quarters = selectedMetricsData[0]?.historicalData.map((d) => d.quarter) || []

    return quarters
      .map((quarter) => {
        const dataPoint: any = { quarter }
        selectedMetricsData.forEach((metric) => {
          const quarterData = metric?.historicalData.find((d) => d.quarter === quarter)
          if (quarterData) {
            dataPoint[metric.id] = quarterData.value
          }
        })
        return dataPoint
      })
      .reverse() // Show chronologically
  }, [selectedMetricsData])

  // Prepare peer comparison data
  const peerComparisonData = useMemo(() => {
    if (selectedMetricsData.length === 0) return []

    const banks = ["Our Bank", "Peer A", "Peer B", "Peer C", "Industry Avg"]

    return banks.map((bank) => {
      const dataPoint: any = { bank }
      selectedMetricsData.forEach((metric) => {
        const bankData = metric?.peerData.find((p) => p.bank === bank)
        if (bankData) {
          dataPoint[`${metric.id}_value`] = bankData.value
          dataPoint[`${metric.id}_yoy`] = bankData.yoyChange || 0
          dataPoint[`${metric.id}_qoq`] = bankData.qoqChange || 0
        }
      })
      return dataPoint
    })
  }, [selectedMetricsData])

  // Filtered and visible data for rendering
  const renderableData = useMemo(() => {
    const finalRenderList: LineItem[] = []
    const tempVisibleSet = new Set<string>() // Tracks all items that should be in the final list

    // First, identify all level 2 items that match the segment filter
    aggregatedData.forEach((item) => {
      if (item.level === 2) {
        tempVisibleSet.add(item.id)
      }
    })

    // Propagate visibility up to parents for level 2 items
    aggregatedData.forEach((item) => {
      if (item.level === 2 && tempVisibleSet.has(item.id)) {
        let currentItem = item
        while (currentItem.level > 0) {
          const parentPrefix = currentItem._prefix?.substring(0, currentItem._prefix.lastIndexOf("."))
          const parent = aggregatedData.find((p) => p._prefix === parentPrefix && p.level === currentItem.level - 1)
          if (parent) {
            tempVisibleSet.add(parent.id)
            currentItem = parent
          } else {
            break
          }
        }
      }
    })

    // Now, build the final list, applying expansion logic
    aggregatedData.forEach((item) => {
      if (!tempVisibleSet.has(item.id) && item.level === 2) {
        return // Skip level 2 items not relevant to the segment filter
      }

      if (item.level === 0) {
        finalRenderList.push(item)
      } else if (item.level === 1) {
        const parent0 = aggregatedData.find((p) => p.level === 0 && item._prefix?.startsWith(p._prefix + "."))
        if (parent0 && expandedRows.has(parent0.id)) {
          finalRenderList.push(item)
        }
      } else if (item.level === 2) {
        const parent1 = aggregatedData.find((p) => p.level === 1 && item._prefix?.startsWith(p._prefix + "."))
        if (parent1 && expandedRows.has(parent1.id)) {
          finalRenderList.push(item)
        }
      }
    })

    return finalRenderList
  }, [aggregatedData, expandedRows])

  // Helper function to render table cells for a given item
  const renderCells = (item: LineItem, isExpanded?: boolean) => {
    const variancePositive = item.variance !== undefined && item.variance > 0
    const varianceNegative = item.variance !== undefined && item.variance < 0

    const variancePercentPositive = item.variancePercent !== undefined && item.variancePercent > 0
    const variancePercentNegative = item.variancePercent !== undefined && item.variancePercent < 0

    return (
      <>
        <TableCell className={cn("font-medium text-gray-800", `pl-${item.level * 4 + 4}`)}>
          <div className="flex items-center gap-2">
            {item.category}
            {(item.level === 0 || item.level === 1) && ( // Only show chevron for collapsible parents
              <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
            )}
          </div>
        </TableCell>
        <TableCell className="text-right text-gray-700">
          {item.current !== undefined ? formatCurrency(item.current) : "-"}
        </TableCell>
        <TableCell className="text-right text-gray-700">
          {item.previous !== undefined ? formatCurrency(item.previous) : "-"}
        </TableCell>
        <TableCell className="text-right">
          {item.variance !== undefined ? (
            <div
              className={cn(
                "flex items-center justify-end space-x-1",
                variancePositive ? "text-green-600" : varianceNegative ? "text-red-600" : "text-gray-500",
              )}
            >
              {item.variance !== 0 &&
                (variancePositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />)}
              <span>{formatCurrency(item.variance)}</span>
            </div>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell className="text-right">
          {item.variancePercent !== undefined ? (
            <Badge
              variant={variancePercentPositive ? "default" : "destructive"}
              className={cn("text-xs rounded-full px-2 py-0.5", variancePercentNegative && "bg-red-100 text-red-600")}
            >
              {formatPercent(item.variancePercent)}
            </Badge>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          {item.segment ? (
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
            >
              {item.segment}
            </Badge>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell className="max-w-xs truncate text-gray-700">{item.aiExplanation || "-"}</TableCell>
      </>
    )
  }

  // Only process URL parameter on initial load or when URL actually changes
  useEffect(() => {
    const metricId = searchParams.get("metricId")

    // Only process if we haven't already processed the initial URL or if the URL has changed
    if (!metricId || hasProcessedInitialUrl.current) {
      return
    }

    hasProcessedInitialUrl.current = true

    // Update selectedMetrics only if it's different
    setSelectedMetricsForChart((prev) => {
      if (prev.size === 1 && prev.has(metricId)) return prev
      return new Set([metricId])
    })

    // Show the extra-metrics row only if needed AND not already shown
    const isPopular = popularMetrics.some((m) => m.id === metricId)
    if (!isPopular) {
      setShowAllMetrics(true)
    }
  }, [searchParams, popularMetrics])

  const currentFilter = periodFilters.find((f) => f.id === selectedPeriodType)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Variance Analysis</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Financial metrics analysis and line item breakdown
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 bg-transparent px-6 py-2"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI about this data
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

          {/* Compressed Period Filter */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Calendar className="h-4 w-4 text-apple-blue-600" />
                Period Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Period Type</label>
                  <Select value={selectedPeriodType} onValueChange={setSelectedPeriodType}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodFilters.map((filter) => (
                        <SelectItem key={filter.id} value={filter.id}>
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Current Period</label>
                  <Select
                    value={selectedCurrentPeriod}
                    onValueChange={setSelectedCurrentPeriod}
                    disabled={!currentFilter}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select current" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFilter?.periods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {formatPeriodLabel(period)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Previous Period</label>
                  <Select
                    value={selectedPreviousPeriod}
                    onValueChange={setSelectedPreviousPeriod}
                    disabled={!currentFilter}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select previous" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFilter?.periods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {formatPeriodLabel(period)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 bg-amber-900 text-white hover:bg-amber-800 border-amber-900 text-sm"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compressed Multi-Select Filters - Single Row */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                <Filter className="h-5 w-5 text-apple-blue-600" />
                <span>Analysis Filters</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Filter data by metrics, categories, and banks to focus your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Metrics to Analyze</label>
                  <MultiSelectDropdown
                    options={metricOptions}
                    selectedValues={selectedMetrics}
                    onSelectionChange={setSelectedMetrics}
                    placeholder="Select metrics..."
                    maxDisplayed={2}
                    className="h-10"
                  />
                  <div className="text-xs text-gray-500">{selectedMetrics.length} selected</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Filter by Category</label>
                  <MultiSelectDropdown
                    options={categoryFilters}
                    selectedValues={selectedCategories}
                    onSelectionChange={setSelectedCategories}
                    placeholder="Select categories..."
                    maxDisplayed={2}
                    className="h-10"
                  />
                  <div className="text-xs text-gray-500">{selectedCategories.length} selected</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Filter by Bank</label>
                  <MultiSelectDropdown
                    options={bankFilters}
                    selectedValues={selectedBanks}
                    onSelectionChange={setSelectedBanks}
                    placeholder="Select banks..."
                    maxDisplayed={2}
                    className="h-10"
                  />
                  <div className="text-xs text-gray-500">{selectedBanks.length} selected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metric Selection Cards */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                <Filter className="h-5 w-5 text-apple-blue-600" />
                <span>Select Metrics for Charts</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Choose from filtered metrics to compare their historical trends and peer performance
                {filteredFinancialRatios.length < financialRatios.length && (
                  <span className="block text-sm text-apple-blue-600 mt-1">
                    Showing {filteredFinancialRatios.length} of {financialRatios.length} metrics based on your filters
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {filteredFinancialRatios.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No metrics match your current filter selection.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedMetrics([])
                    }}
                    className="text-apple-blue-600 border-apple-blue-300 hover:bg-apple-blue-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* First row - always visible popular metrics */}
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
                    {popularMetrics.map((metric) => (
                      <Card
                        key={metric.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                          selectedMetricsForChart.has(metric.id)
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
                            {selectedMetricsForChart.has(metric.id) && (
                              <Check className="h-3 w-3 text-apple-blue-600 flex-shrink-0 ml-1" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-gray-900">
                              {formatValue(metric.historicalData[0]?.value || 0, metric.unit)}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span
                                className={cn(
                                  (metric.historicalData[0]?.yoyChange || 0) > 0 ? "text-green-600" : "text-red-600",
                                )}
                              >
                                {formatChange(metric.historicalData[0]?.yoyChange || 0, metric.unit)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Second row - additional metrics, shown when expanded */}
                  {showAllMetrics && (
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
                      {otherMetrics.map((metric) => (
                        <Card
                          key={metric.id}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                            selectedMetricsForChart.has(metric.id)
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
                              {selectedMetricsForChart.has(metric.id) && (
                                <Check className="h-3 w-3 text-apple-blue-600 flex-shrink-0 ml-1" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-bold text-gray-900">
                                {formatValue(metric.historicalData[0]?.value || 0, metric.unit)}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span
                                  className={cn(
                                    (metric.historicalData[0]?.yoyChange || 0) > 0 ? "text-green-600" : "text-red-600",
                                  )}
                                >
                                  {formatChange(metric.historicalData[0]?.yoyChange || 0, metric.unit)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Show More/Less button */}
                  {otherMetrics.length > 0 && (
                    <div className="flex justify-center pt-4">
                      {!showAllMetrics ? (
                        <Button
                          variant="outline"
                          onClick={() => setShowAllMetrics(true)}
                          className="border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Show {otherMetrics.length} More Metrics
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
              )}
            </CardContent>
          </Card>

          {/* Charts Section */}
          {selectedMetricsForChart.size > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Historical Trend Chart */}
              <Card className="shadow-lg rounded-xl border-none bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Historical Trend</CardTitle>
                  <CardDescription className="text-gray-600">Performance over time</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <ChartContainer
                    config={Object.fromEntries(
                      selectedMetricsData.map((metric, index) => [
                        metric!.id,
                        {
                          label: metric!.name,
                          color: `hsl(var(--chart-${(index % 5) + 1}))`,
                        },
                      ]),
                    )}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        {selectedMetricsData.map((metric, index) => (
                          <Line
                            key={metric!.id}
                            type="monotone"
                            dataKey={metric!.id}
                            stroke={`var(--color-${metric!.id})`}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name={metric!.name}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Peer Comparison Chart */}
              <Card className="shadow-lg rounded-xl border-none bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Peer Comparison</CardTitle>
                  <CardDescription className="text-gray-600">
                    Current period comparison with YoY and QoQ changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <ChartContainer
                    config={Object.fromEntries(
                      selectedMetricsData.map((metric, index) => [
                        `${metric!.id}_value`,
                        {
                          label: metric!.name,
                          color: `hsl(var(--chart-${(index % 5) + 1}))`,
                        },
                      ]),
                    )}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peerComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="bank" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        {selectedMetricsData.map((metric, index) => (
                          <Bar
                            key={metric!.id}
                            dataKey={`${metric!.id}_value`}
                            fill={`var(--color-${metric!.id}_value)`}
                            radius={[4, 4, 0, 0]}
                            name={metric!.name}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Line Item Analysis Table */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Line Item Analysis</CardTitle>
              <CardDescription className="text-gray-600 mb-6">
                Click on any row to view detailed driver breakdown
              </CardDescription>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Segment:</label>
                  <Select value="All" onValueChange={() => {}}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Treasury">Treasury</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-apple-gray-100 hover:bg-apple-gray-100">
                      <TableHead className="text-gray-700 font-semibold py-4">Line Item</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold py-4">Current</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold py-4">Previous</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold py-4">Variance ($)</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold py-4">Variance (%)</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">Segment</TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4">AI Explanation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderableData.map((item) => {
                      const isParent = item.level !== 2
                      const isExpanded = expandedRows.has(item.id)

                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            "cursor-pointer hover:bg-apple-gray-50 transition-colors duration-200 border-b border-gray-100",
                            item.level === 0 && "font-bold bg-apple-gray-100 hover:bg-apple-gray-200",
                            item.level === 1 && "font-semibold",
                          )}
                          onClick={() => {
                            if (isParent) {
                              toggleRow(item.id)
                            }
                          }}
                        >
                          {renderCells(item, isExpanded)}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
