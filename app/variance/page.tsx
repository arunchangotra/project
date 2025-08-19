"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financialRatios } from "@/lib/financial-ratios"
import { TrendingUp, TrendingDown, Filter, ChevronDown, Check, Plus, MessageSquare, Building2 } from "lucide-react"
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
import { PeriodFilterComponent } from "@/components/period-filter"
import { MultiSelectDropdown } from "@/components/multi-select-dropdown"
import { metricOptions } from "@/lib/filter-options"
import { LineItemFilters } from "@/components/line-item-filters"
import { DataLoadingWrapper } from "@/components/data-loading-wrapper"
import { useFilteredLineItems, useFilterOptions, useBankMetrics, useHistoricalData } from "@/lib/data-hooks"

// Helper function to format currency
const formatCurrency = (value: number | null) => {
  if (value === null) return "-"
  return `$${Math.abs(value).toFixed(0)}M`
}

// Helper function to format percentage change
const formatPercent = (value: number | null) => {
  if (value === null) return "-"
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}

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

// Chart filter types
type ChartFilterType = "Actual" | "QoQ" | "YoY" | "Year"

export default function VarianceAnalysis() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Track if we've already processed the initial URL parameter
  const hasProcessedInitialUrl = useRef(false)

  // Global bank filter state
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["ADIB"])

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

  // Chart filter states
  const [historicalChartFilter, setHistoricalChartFilter] = useState<ChartFilterType>("Actual")
  const [peerChartFilter, setPeerChartFilter] = useState<ChartFilterType>("Actual")

  // Multiple metrics selection state for charts
  const [selectedMetricsForChart, setSelectedMetricsForChart] = useState<Set<string>>(() => {
    const metricId = searchParams.get("metricId")
    if (metricId) {
      hasProcessedInitialUrl.current = true
      return new Set([metricId])
    }
    return new Set(["NIM", "ROA"])
  })

  // State to show all metrics
  const [showAllMetrics, setShowAllMetrics] = useState(false)

  // State variables for line item filters
  const [selectedBanksForLineItems, setSelectedBanksForLineItems] = useState<string[]>(["ADIB"])
  const [selectedCategoriesForLineItems, setSelectedCategoriesForLineItems] = useState<string[]>(["P&L"])
  const [selectedPeriodsForLineItems, setSelectedPeriodsForLineItems] = useState<string[]>(["jas_2024", "amj_2024"])
  const [selectedColumnsForLineItems, setSelectedColumnsForLineItems] = useState<string[]>([
    "item",
    "current_period",
    "previous_period",
    "variance",
    "variance_percent",
    "segment",
    "ai_explanation",
  ])

  // Get filter options from CSV data
  const filterOptions = useFilterOptions()

  // Get filtered line items from CSV data
  const { data: lineItemsData, isLoading: lineItemsLoading } = useFilteredLineItems({
    banks: selectedBanksForLineItems,
    categories: selectedCategoriesForLineItems,
    periods: selectedPeriodsForLineItems,
  })

  // Get bank metrics for peer comparison
  const bankMetrics = useBankMetrics(selectedBanks, Array.from(selectedMetricsForChart))

  // Get historical data for selected banks and metrics
  const historicalData = useHistoricalData(selectedBanks[0] || "ADIB", Array.from(selectedMetricsForChart))

  // Filter financial ratios based on selected categories and metrics
  const filteredFinancialRatios = useMemo(() => {
    let filtered = financialRatios

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ratio) =>
        selectedCategories.some((category) => {
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

    if (selectedMetrics.length > 0) {
      filtered = filtered.filter((ratio) => {
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

  // Prepare chart data for multiple metrics with filter support
  const chartData = useMemo(() => {
    if (selectedMetricsData.length === 0 || !historicalData) return []

    // Get all quarters from historical data
    const allQuarters = new Set<string>()
    Object.values(historicalData).forEach((metricData) => {
      metricData.forEach((point) => allQuarters.add(point.quarter))
    })

    const quarters = Array.from(allQuarters).sort()

    return quarters.map((quarter) => {
      const dataPoint: any = { quarter }
      selectedMetricsData.forEach((metric) => {
        const metricHistoricalData = historicalData[metric!.id] || []
        const quarterData = metricHistoricalData.find((d) => d.quarter === quarter)
        if (quarterData) {
          dataPoint[metric!.id] = quarterData.value
        }
      })
      return dataPoint
    })
  }, [selectedMetricsData, historicalData])

  // Prepare peer comparison data using actual bank data from CSV
  const peerComparisonData = useMemo(() => {
    if (selectedMetricsData.length === 0 || !bankMetrics) return []

    return Object.entries(bankMetrics).map(([bank, metrics]) => {
      const dataPoint: any = { bank }
      selectedMetricsData.forEach((metric) => {
        const value = metrics[metric!.id]
        if (value !== undefined) {
          dataPoint[`${metric!.id}_value`] = value
        }
      })
      return dataPoint
    })
  }, [selectedMetricsData, bankMetrics])

  // Custom tooltip for peer comparison chart
  const PeerComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const metricId = entry.dataKey.replace("_value", "")
            const metric = selectedMetricsData.find((m) => m!.id === metricId)
            const unit = metric?.unit || ""

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${metric?.name}: ${formatValue(entry.value, unit)}`}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  // Helper function to render table cells for a given item
  const renderCells = (item: any, isExpanded?: boolean) => {
    const shouldShowBankSpecificData = selectedBanksForLineItems.length > 1

    return (
      <>
        {selectedColumnsForLineItems.includes("item") && (
          <TableCell className={cn("font-medium text-gray-800", `pl-${(item.level || 0) * 4 + 4}`)}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">{item.id || ""}</span>
              {item.item}
              {shouldShowBankSpecificData && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {item.bank}
                </Badge>
              )}
              {(item.level === 0 || item.level === 1) && (
                <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
              )}
            </div>
          </TableCell>
        )}
        {selectedColumnsForLineItems.includes("current_period") && (
          <TableCell className="text-right text-gray-700">{formatCurrency(item.currentValue)}</TableCell>
        )}
        {selectedColumnsForLineItems.includes("previous_period") && (
          <TableCell className="text-right text-gray-700">{formatCurrency(item.previousValue)}</TableCell>
        )}
        {selectedColumnsForLineItems.includes("variance") && (
          <TableCell className="text-right">
            {item.variance !== null ? (
              <div
                className={cn(
                  "flex items-center justify-end space-x-1",
                  item.variance > 0 ? "text-green-600" : item.variance < 0 ? "text-red-600" : "text-gray-500",
                )}
              >
                {item.variance !== 0 &&
                  (item.variance > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />)}
                <span>{formatCurrency(item.variance)}</span>
              </div>
            ) : (
              "-"
            )}
          </TableCell>
        )}
        {selectedColumnsForLineItems.includes("variance_percent") && (
          <TableCell className="text-right">
            {item.variancePercent !== null ? (
              <Badge
                variant={item.variancePercent > 0 ? "default" : "destructive"}
                className={cn(
                  "text-xs rounded-full px-2 py-0.5",
                  item.variancePercent < 0 && "bg-red-100 text-red-600",
                )}
              >
                {formatPercent(item.variancePercent)}
              </Badge>
            ) : (
              "-"
            )}
          </TableCell>
        )}
        {selectedColumnsForLineItems.includes("segment") && (
          <TableCell>
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200"
            >
              {item.subCategory1 || "General"}
            </Badge>
          </TableCell>
        )}
        {selectedColumnsForLineItems.includes("ai_explanation") && (
          <TableCell className="max-w-xs truncate text-gray-700">{item.alias || "Analysis available"}</TableCell>
        )}
      </>
    )
  }

  // Chart Filter Button Component
  const ChartFilterButtons = ({
    activeFilter,
    onFilterChange,
    className = "",
  }: {
    activeFilter: ChartFilterType
    onFilterChange: (filter: ChartFilterType) => void
    className?: string
  }) => {
    const filters: ChartFilterType[] = ["Actual", "QoQ", "YoY", "Year"]

    return (
      <div className={cn("flex gap-1", className)}>
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "h-7 px-3 text-xs font-medium rounded-md transition-all",
              activeFilter === filter
                ? "bg-apple-blue-600 text-white hover:bg-apple-blue-700 border-apple-blue-600"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300",
            )}
          >
            {filter}
          </Button>
        ))}
      </div>
    )
  }

  // Sync global bank filter with line item bank filter
  useEffect(() => {
    setSelectedBanksForLineItems(selectedBanks)
  }, [selectedBanks])

  // Update available banks from CSV data
  useEffect(() => {
    if (filterOptions.banks.length > 0 && selectedBanks.length === 1 && selectedBanks[0] === "ADIB") {
      // Set first available bank if ADIB is not available
      if (!filterOptions.banks.includes("ADIB") && filterOptions.banks.length > 0) {
        setSelectedBanks([filterOptions.banks[0]])
      }
    }
  }, [filterOptions.banks])

  return (
    <DataLoadingWrapper>
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

            {/* Compact Global Bank Filter */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-apple-blue-50 to-blue-50 rounded-lg border border-apple-blue-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-apple-blue-600" />
                  <span className="text-sm font-medium text-gray-800">Banks:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.banks.map((bank) => (
                    <Button
                      key={bank}
                      variant={selectedBanks.includes(bank) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedBanks((prev) => {
                          if (prev.includes(bank)) {
                            return prev.filter((b) => b !== bank)
                          } else {
                            return [...prev, bank]
                          }
                        })
                      }}
                      className={cn(
                        "h-7 px-3 text-xs font-medium rounded-md transition-all",
                        selectedBanks.includes(bank)
                          ? "bg-apple-blue-600 text-white hover:bg-apple-blue-700 border-apple-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300",
                      )}
                    >
                      {bank}
                      {selectedBanks.includes(bank) && <Check className="h-3 w-3 ml-1" />}
                    </Button>
                  ))}
                </div>
              </div>
              {selectedBanks.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBanks([])}
                  className="text-xs px-2 py-1 h-7 text-gray-600 hover:text-gray-800 border-gray-300"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Period Filter */}
            <PeriodFilterComponent
              selectedPeriodType={selectedPeriodType}
              onPeriodTypeChange={setSelectedPeriodType}
              selectedCurrentPeriod={selectedCurrentPeriod}
              selectedPreviousPeriod={selectedPreviousPeriod}
              onCurrentPeriodChange={setSelectedCurrentPeriod}
              onPreviousPeriodChange={setSelectedPreviousPeriod}
            />

            {/* Compact Metric Selection */}
            <Card className="shadow-sm rounded-lg border-gray-200 bg-white">
              <CardContent className="p-4">
                {/* Compact Analysis Filters */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-apple-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Metrics:</label>
                        <MultiSelectDropdown
                          options={metricOptions}
                          selectedValues={selectedMetrics}
                          onSelectionChange={setSelectedMetrics}
                          placeholder="Select..."
                          maxDisplayed={0}
                          className="h-7 w-32 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Categories:</label>
                        <MultiSelectDropdown
                          options={filterOptions.categories.map((cat) => ({ value: cat, label: cat }))}
                          selectedValues={selectedCategories}
                          onSelectionChange={setSelectedCategories}
                          placeholder="Select..."
                          maxDisplayed={0}
                          className="h-7 w-32 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  {(selectedMetrics.length > 0 || selectedCategories.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMetrics([])
                        setSelectedCategories([])
                      }}
                      className="text-xs px-2 py-1 h-7 text-gray-600 hover:text-gray-800 border-gray-300"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Filtered Results Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">Select Metrics for Charts:</span>
                    {filteredFinancialRatios.length < financialRatios.length && (
                      <Badge variant="outline" className="text-xs">
                        {filteredFinancialRatios.length} of {financialRatios.length} metrics
                      </Badge>
                    )}
                    {selectedBanks.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-apple-blue-50 text-apple-blue-700">
                        {selectedBanks.join(", ")}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Metric Selection Cards */}
                {filteredFinancialRatios.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">No metrics match your current filter selection.</p>
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
                  <div className="space-y-3">
                    {/* Compact metric cards grid */}
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                      {popularMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:shadow-sm border-2 rounded-md p-2",
                            selectedMetricsForChart.has(metric.id)
                              ? "border-apple-blue-600 bg-apple-blue-50"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => toggleMetric(metric.id)}
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <h3 className="font-semibold text-xs text-gray-800 truncate">{metric.name}</h3>
                              {selectedMetricsForChart.has(metric.id) && (
                                <Check className="h-3 w-3 text-apple-blue-600 ml-1" />
                              )}
                            </div>
                            <div className="text-xs font-bold text-gray-900">
                              {formatValue(metric.historicalData[0]?.value || 0, metric.unit)}
                            </div>
                            <div className="text-xs">
                              <span
                                className={cn(
                                  (metric.historicalData[0]?.yoyChange || 0) > 0 ? "text-green-600" : "text-red-600",
                                )}
                              >
                                {formatChange(metric.historicalData[0]?.yoyChange || 0, metric.unit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compact additional metrics */}
            {showAllMetrics && (
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                {otherMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-sm border-2 rounded-md p-2",
                      selectedMetricsForChart.has(metric.id)
                        ? "border-apple-blue-600 bg-apple-blue-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => toggleMetric(metric.id)}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <h3 className="font-semibold text-xs text-gray-800 truncate">{metric.name}</h3>
                        {selectedMetricsForChart.has(metric.id) && (
                          <Check className="h-3 w-3 text-apple-blue-600 ml-1" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        {formatValue(metric.historicalData[0]?.value || 0, metric.unit)}
                      </div>
                      <div className="text-xs">
                        <span
                          className={cn(
                            (metric.historicalData[0]?.yoyChange || 0) > 0 ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {formatChange(metric.historicalData[0]?.yoyChange || 0, metric.unit)}
                        </span>
                      </div>
                    </div>
                  </div>
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
                    className="border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />+{otherMetrics.length} More
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllMetrics(false)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1 h-7 text-xs"
                  >
                    Show Less
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Charts Section */}
          {selectedMetricsForChart.size > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Historical Trend Chart */}
              <Card className="shadow-lg rounded-xl border-none bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">Historical Trend</CardTitle>
                      <CardDescription className="text-gray-600">Performance over time</CardDescription>
                    </div>
                    <ChartFilterButtons
                      activeFilter={historicalChartFilter}
                      onFilterChange={setHistoricalChartFilter}
                    />
                  </div>
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
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="quarter"
                          tickLine={false}
                          axisLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis tickLine={false} axisLine={false} width={60} />
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
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">Peer Comparison</CardTitle>
                      <CardDescription className="text-gray-600">
                        Current period comparison across banks
                      </CardDescription>
                    </div>
                    <ChartFilterButtons activeFilter={peerChartFilter} onFilterChange={setPeerChartFilter} />
                  </div>
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
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="bank"
                          tickLine={false}
                          axisLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis tickLine={false} axisLine={false} width={60} />
                        <Tooltip content={<PeerComparisonTooltip />} />
                        <Legend />
                        {selectedMetricsData.map((metric, index) => (
                          <Bar
                            key={metric!.id}
                            dataKey={`${metric!.id}_value`}
                            fill={`var(--color-${metric!.id}_value)`}
                            radius={[4, 4, 0, 0]}
                            name={metric!.name}
                            maxBarSize={60}
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
          <div className="space-y-6">
            {/* Line Item Filters */}
            <LineItemFilters
              selectedBanks={selectedBanksForLineItems}
              selectedCategories={selectedCategoriesForLineItems}
              selectedPeriods={selectedPeriodsForLineItems}
              selectedColumns={selectedColumnsForLineItems}
              onBanksChange={setSelectedBanksForLineItems}
              onCategoriesChange={setSelectedCategoriesForLineItems}
              onPeriodsChange={setSelectedPeriodsForLineItems}
              onColumnsChange={setSelectedColumnsForLineItems}
            />

            {/* Enhanced Line Item Analysis Table */}
            <Card className="shadow-lg rounded-xl border-none bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">Line Item Analysis</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Click on any row to view detailed driver breakdown
                      {selectedBanksForLineItems.length > 0 && (
                        <span className="block text-sm text-apple-blue-600 mt-1">
                          {selectedBanksForLineItems.length === 1
                            ? `Showing data for: ${selectedBanksForLineItems[0]}`
                            : `Showing comparative data for: ${selectedBanksForLineItems.join(", ")} (${selectedBanksForLineItems.length} banks)`}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {lineItemsData.length} items
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {selectedColumnsForLineItems.length} columns
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {lineItemsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading line items...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-apple-gray-100 hover:bg-apple-gray-100">
                          {selectedColumnsForLineItems.includes("item") && (
                            <TableHead className="text-gray-700 font-semibold py-4">Line Item</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("current_period") && (
                            <TableHead className="text-right text-gray-700 font-semibold py-4">Current</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("previous_period") && (
                            <TableHead className="text-right text-gray-700 font-semibold py-4">Previous</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("variance") && (
                            <TableHead className="text-right text-gray-700 font-semibold py-4">Variance ($)</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("variance_percent") && (
                            <TableHead className="text-right text-gray-700 font-semibold py-4">Variance (%)</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("segment") && (
                            <TableHead className="text-gray-700 font-semibold py-4">Segment</TableHead>
                          )}
                          {selectedColumnsForLineItems.includes("ai_explanation") && (
                            <TableHead className="text-gray-700 font-semibold py-4">AI Explanation</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItemsData.map((item) => {
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DataLoadingWrapper>
  )
}
