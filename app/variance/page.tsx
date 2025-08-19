"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Settings,
  Calendar,
  Building2,
  ChevronDown,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DataLoadingWrapper } from "@/components/data-loading-wrapper"
import { useFilterOptions, useFilteredLineItems, useHistoricalData, useBankMetrics } from "@/lib/data-hooks"
import { MetricMultiSelect } from "@/components/metric-multi-select"
import { financialRatios } from "@/lib/financial-ratios"

export default function VarianceAnalysis() {
  // Get filter options from CSV data
  const filterOptions = useFilterOptions()

  // Filter states
  const [selectedBanks, setSelectedBanks] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedSegments, setSelectedSegments] = useState<string[]>(["consolidated"])
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Chart and display states
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["NIM", "ROE", "ROA"])
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(["item", "bank", "category", "currentValue", "previousValue", "variance", "variancePercent"]),
  )

  // Filter dropdown states
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false)
  const [periodFilterOpen, setPeriodFilterOpen] = useState(false)
  const [segmentFilterOpen, setSegmentFilterOpen] = useState(false)

  // Initialize filters when data loads
  useEffect(() => {
    if (filterOptions.banks.length > 0 && selectedBanks.length === 0) {
      setSelectedBanks([filterOptions.banks[0]])
    }
  }, [filterOptions.banks])

  useEffect(() => {
    if (filterOptions.categories.length > 0 && selectedCategories.length === 0) {
      const defaultCategories = filterOptions.categories.filter((cat) => ["P&L", "KPI"].includes(cat)).slice(0, 2)
      setSelectedCategories(defaultCategories.length > 0 ? defaultCategories : [filterOptions.categories[0]])
    }
  }, [filterOptions.categories])

  useEffect(() => {
    if (filterOptions.periods.length > 0 && selectedPeriods.length === 0) {
      const latestPeriod = filterOptions.periods.find((p) => p.includes("jas_2024")) || filterOptions.periods[0]
      setSelectedPeriods([latestPeriod])
    }
  }, [filterOptions.periods])

  // Segment filter options
  const segmentFilterOptions = [
    { value: "consolidated", label: "Consolidated" },
    { value: "corporate", label: "Corporate Banking" },
    { value: "retail", label: "Retail Banking" },
    { value: "investment", label: "Investment Banking" },
    { value: "treasury", label: "Treasury" },
    { value: "islamic", label: "Islamic Banking" },
  ]

  // Memoize filter object to prevent infinite loops
  const filters = useMemo(
    () => ({
      banks: selectedBanks,
      categories: selectedCategories,
      periods: selectedPeriods,
      items: selectedItems,
    }),
    [selectedBanks, selectedCategories, selectedPeriods, selectedItems],
  )

  // Get filtered line items
  const { data: lineItems, isLoading: lineItemsLoading } = useFilteredLineItems(filters)

  // Get historical data for charts
  const historicalData = useHistoricalData(selectedBanks[0] || "", selectedMetrics)

  // Get bank metrics for peer comparison
  const bankMetrics = useBankMetrics(selectedBanks, selectedMetrics)

  // Filter toggle functions
  const toggleBank = useCallback((bankValue: string) => {
    setSelectedBanks((prev) => (prev.includes(bankValue) ? prev.filter((b) => b !== bankValue) : [...prev, bankValue]))
  }, [])

  const toggleCategory = useCallback((categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue) ? prev.filter((c) => c !== categoryValue) : [...prev, categoryValue],
    )
  }, [])

  const togglePeriod = useCallback((periodValue: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(periodValue) ? prev.filter((p) => p !== periodValue) : [...prev, periodValue],
    )
  }, [])

  const toggleSegment = useCallback((segmentValue: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentValue) ? prev.filter((s) => s !== segmentValue) : [...prev, segmentValue],
    )
  }, [])

  const clearAllFilters = useCallback(() => {
    if (filterOptions.banks.length > 0) {
      setSelectedBanks([filterOptions.banks[0]])
    }
    if (filterOptions.categories.length > 0) {
      const defaultCategories = filterOptions.categories.filter((cat) => ["P&L", "KPI"].includes(cat)).slice(0, 2)
      setSelectedCategories(defaultCategories.length > 0 ? defaultCategories : [filterOptions.categories[0]])
    }
    if (filterOptions.periods.length > 0) {
      const latestPeriod = filterOptions.periods.find((p) => p.includes("jas_2024")) || filterOptions.periods[0]
      setSelectedPeriods([latestPeriod])
    }
    setSelectedSegments(["consolidated"])
    setSelectedItems([])
  }, [filterOptions.banks, filterOptions.categories, filterOptions.periods])

  const toggleColumnVisibility = useCallback((column: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(column)) {
        newSet.delete(column)
      } else {
        newSet.add(column)
      }
      return newSet
    })
  }, [])

  // Prepare chart data
  const historicalChartData = useMemo(() => {
    if (!selectedMetrics.length || !selectedBanks.length) return []

    const quarters = ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024", "Q3 2024"]

    return quarters.map((quarter) => {
      const dataPoint: any = { quarter }

      selectedMetrics.forEach((metricId) => {
        const data = historicalData[metricId] || []
        const quarterData = data.find((d) => d.quarter === quarter)
        dataPoint[metricId] = quarterData?.value || null
      })

      return dataPoint
    })
  }, [selectedMetrics, selectedBanks, historicalData])

  const peerComparisonData = useMemo(() => {
    if (!selectedMetrics.length || !selectedBanks.length) return []

    return selectedMetrics.map((metricId) => {
      const metricInfo = financialRatios.find((m) => m.id === metricId)
      const dataPoint: any = {
        metric: metricInfo?.name || metricId,
        metricId,
      }

      selectedBanks.forEach((bank) => {
        const metrics = bankMetrics[bank] || {}
        dataPoint[bank] = metrics[metricId] || 0
      })

      return dataPoint
    })
  }, [selectedMetrics, selectedBanks, bankMetrics])

  const formatValue = useCallback((value: number | null, unit?: string) => {
    if (value === null || value === undefined) return "N/A"

    if (unit === "%") return `${value.toFixed(2)}%`
    if (unit === "$M") return `$${value.toFixed(0)}M`
    if (unit === "$") return `$${value.toFixed(2)}`
    if (unit === "x") return `${value.toFixed(2)}x`

    return value.toFixed(2)
  }, [])

  const getVarianceColor = useCallback((variance: number | null) => {
    if (variance === null) return "text-gray-500"
    if (variance > 0) return "text-green-600"
    if (variance < 0) return "text-red-600"
    return "text-gray-500"
  }, [])

  return (
    <DataLoadingWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Variance Analysis</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Analyze financial performance variations across periods and banks
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 bg-transparent px-6 py-2"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask AI about variances
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent px-6 py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
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
                    <CardTitle className="text-xl font-semibold text-gray-800">Global Filters</CardTitle>
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
                  Filter analysis by bank, category, period, and segment
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
                          {filterOptions.categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="h-4 w-4"
                              />
                              <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer flex-1">
                                {category}
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
                          {filterOptions.periods.map((period) => (
                            <div key={period} className="flex items-center space-x-2">
                              <Checkbox
                                id={period}
                                checked={selectedPeriods.includes(period)}
                                onCheckedChange={() => togglePeriod(period)}
                                className="h-4 w-4"
                              />
                              <label htmlFor={period} className="text-sm text-gray-700 cursor-pointer flex-1">
                                {period.replace("_", " ").toUpperCase()}
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
                    {filterOptions.banks.map((bank) => (
                      <Button
                        key={bank}
                        variant={selectedBanks.includes(bank) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleBank(bank)}
                        className={cn(
                          "h-9 px-4 text-sm font-medium transition-all",
                          selectedBanks.includes(bank)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                        )}
                      >
                        {bank}
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
                      <strong>Periods:</strong> {selectedPeriods.join(", ") || "None"}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Segments:</strong> {selectedSegments.join(", ") || "None"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Historical Trends Chart */}
              <Card className="shadow-lg rounded-xl border-none bg-white">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800">Historical Trends</CardTitle>
                    <MetricMultiSelect
                      selectedMetrics={selectedMetrics}
                      onMetricsChange={setSelectedMetrics}
                      maxSelection={5}
                    />
                  </div>
                  <CardDescription className="text-gray-600">
                    Track key metrics over time for {selectedBanks.join(", ") || "selected banks"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      ...selectedMetrics.reduce((acc, metricId, index) => {
                        acc[metricId] = {
                          label: financialRatios.find((m) => m.id === metricId)?.name || metricId,
                          color: `hsl(var(--chart-${(index % 5) + 1}))`,
                        }
                        return acc
                      }, {} as any),
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="quarter" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} width={60} tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {selectedMetrics.map((metricId, index) => (
                          <Line
                            key={metricId}
                            type="monotone"
                            dataKey={metricId}
                            stroke={`var(--color-${metricId})`}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            connectNulls={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Peer Comparison Chart */}
              <Card className="shadow-lg rounded-xl border-none bg-white">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-800">Peer Comparison</CardTitle>
                  <CardDescription className="text-gray-600">
                    Compare selected metrics across banks for latest period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      ...selectedBanks.reduce((acc, bank, index) => {
                        acc[bank] = {
                          label: bank,
                          color: `hsl(var(--chart-${(index % 5) + 1}))`,
                        }
                        return acc
                      }, {} as any),
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                        {selectedBanks.map((bank, index) => (
                          <Bar
                            key={bank}
                            dataKey={bank}
                            fill={`var(--color-${bank})`}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Line Items Table */}
            <Card className="shadow-lg rounded-xl border-none bg-white">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">Line Item Analysis</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Detailed variance analysis for {lineItems.length} line items
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Columns
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-4" align="end">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-900">Visible Columns</h4>
                          <div className="space-y-2">
                            {[
                              { key: "item", label: "Item" },
                              { key: "bank", label: "Bank" },
                              { key: "category", label: "Category" },
                              { key: "currentValue", label: "Current Value" },
                              { key: "previousValue", label: "Previous Value" },
                              { key: "variance", label: "Variance" },
                              { key: "variancePercent", label: "Variance %" },
                            ].map((column) => (
                              <div key={column.key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={column.key}
                                  checked={visibleColumns.has(column.key)}
                                  onCheckedChange={() => toggleColumnVisibility(column.key)}
                                  className="h-4 w-4"
                                />
                                <label htmlFor={column.key} className="text-sm text-gray-700 cursor-pointer flex-1">
                                  {column.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {lineItemsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading line items...</div>
                  </div>
                ) : lineItems.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">No line items found for the selected filters</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {visibleColumns.has("item") && (
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
                          )}
                          {visibleColumns.has("bank") && (
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Bank</th>
                          )}
                          {visibleColumns.has("category") && (
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                          )}
                          {visibleColumns.has("currentValue") && (
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Current</th>
                          )}
                          {visibleColumns.has("previousValue") && (
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Previous</th>
                          )}
                          {visibleColumns.has("variance") && (
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Variance</th>
                          )}
                          {visibleColumns.has("variancePercent") && (
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Variance %</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.slice(0, 50).map((item, index) => (
                          <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            {visibleColumns.has("item") && (
                              <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">{item.item}</td>
                            )}
                            {visibleColumns.has("bank") && (
                              <td className="py-3 px-4 text-sm">
                                <Badge variant="outline" className="text-xs">
                                  {item.bank}
                                </Badge>
                              </td>
                            )}
                            {visibleColumns.has("category") && (
                              <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                            )}
                            {visibleColumns.has("currentValue") && (
                              <td className="py-3 px-4 text-sm text-right font-medium">
                                {formatValue(item.currentValue)}
                              </td>
                            )}
                            {visibleColumns.has("previousValue") && (
                              <td className="py-3 px-4 text-sm text-right text-gray-600">
                                {formatValue(item.previousValue)}
                              </td>
                            )}
                            {visibleColumns.has("variance") && (
                              <td
                                className={`py-3 px-4 text-sm text-right font-medium ${getVarianceColor(item.variance)}`}
                              >
                                <div className="flex items-center justify-end space-x-1">
                                  {item.variance !== null && item.variance !== 0 && (
                                    <>
                                      {item.variance > 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                      ) : (
                                        <TrendingDown className="h-3 w-3" />
                                      )}
                                    </>
                                  )}
                                  <span>{formatValue(item.variance)}</span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.has("variancePercent") && (
                              <td
                                className={`py-3 px-4 text-sm text-right font-medium ${getVarianceColor(item.variancePercent)}`}
                              >
                                {item.variancePercent !== null ? `${item.variancePercent.toFixed(1)}%` : "N/A"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {lineItems.length > 50 && (
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Showing first 50 of {lineItems.length} items
                      </div>
                    )}
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
