"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown, MessageSquare } from "lucide-react"
import Link from "next/link"
import { quarterlyData, currentQuarter, previousQuarter } from "@/lib/sample-data"
import { MetricMultiSelect } from "@/components/metric-multi-select"
import { detailedVarianceData, type LineItem } from "@/lib/sample-data"
import { financialRatios } from "@/lib/financial-ratios"
import { cn } from "@/lib/utils"

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
  const incomeTax = processedData.find((item) => item.id === "income-tax")

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

  const patItem = processedData.find((item) => item.id === "profit-after-tax")
  if (patItem && pbtItem?.current !== undefined && incomeTax?.current !== undefined) {
    patItem.current = pbtItem.current - incomeTax.current
    patItem.previous = (pbtItem.previous ?? 0) - (incomeTax.previous ?? 0)
    patItem.variance = patItem.current - patItem.previous
    patItem.variancePercent = patItem.previous !== 0 ? (patItem.variance / patItem.previous) * 100 : 0
  }

  return processedData
}

// Helper function to format percentage
const formatPercentage = (value: number) => `${value.toFixed(2)}%`

export default function VarianceAnalysis() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "net-interest-income",
    "total-revenue",
    "net-income",
  ])

  const current = quarterlyData[currentQuarter as keyof typeof quarterlyData]
  const previous = quarterlyData[previousQuarter as keyof typeof quarterlyData]

  const calculateVariance = (currentValue: number, previousValue: number) => {
    const absolute = currentValue - previousValue
    const percentage = (absolute / previousValue) * 100
    return { absolute, percentage, isPositive: absolute >= 0 }
  }

  const aggregatedData = calculateAggregates(detailedVarianceData)

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set<string>())

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

  const variances = [
    {
      id: "net-interest-income",
      name: "Net Interest Income",
      current: current.netInterestIncome,
      previous: previous.netInterestIncome,
      format: "currency",
    },
    {
      id: "non-interest-income",
      name: "Non-Interest Income",
      current: current.nonInterestIncome,
      previous: previous.nonInterestIncome,
      format: "currency",
    },
    {
      id: "total-revenue",
      name: "Total Revenue",
      current: current.totalRevenue,
      previous: previous.totalRevenue,
      format: "currency",
    },
    {
      id: "net-income",
      name: "Net Income",
      current: current.netIncome,
      previous: previous.netIncome,
      format: "currency",
    },
    {
      id: "loan-loss-provisions",
      name: "Loan Loss Provisions",
      current: current.loanLossProvisions,
      previous: previous.loanLossProvisions,
      format: "currency",
    },
    {
      id: "net-interest-margin",
      name: "Net Interest Margin",
      current: current.netInterestMargin,
      previous: previous.netInterestMargin,
      format: "percentage",
    },
    {
      id: "return-on-equity",
      name: "Return on Equity",
      current: current.returnOnEquity,
      previous: previous.returnOnEquity,
      format: "percentage",
    },
    {
      id: "return-on-assets",
      name: "Return on Assets",
      current: current.returnOnAssets,
      previous: previous.returnOnAssets,
      format: "percentage",
    },
    {
      id: "efficiency-ratio",
      name: "Efficiency Ratio",
      current: current.efficiencyRatio,
      previous: previous.efficiencyRatio,
      format: "percentage",
    },
    {
      id: "tier1-capital-ratio",
      name: "Tier 1 Capital Ratio",
      current: current.tier1CapitalRatio,
      previous: previous.tier1CapitalRatio,
      format: "percentage",
    },
  ]

  const filteredVariances = variances.filter((variance) => selectedMetrics.includes(variance.id))

  const renderableData = aggregatedData.filter((item) => selectedMetrics.includes(item.id))

  const renderCells = (item: LineItem, isExpanded?: boolean) => {
    const variancePositive = item.variance !== undefined && item.variance > 0
    const varianceNegative = item.variance !== undefined && item.variance < 0

    const variancePercentPositive = item.variancePercent !== undefined && item.variancePercent > 0
    const variancePercentNegative = item.variancePercent !== undefined && item.variancePercent < 0

    return (
      <>
        <div className={cn("font-medium text-gray-800", `pl-${item.level * 4 + 4}`)}>
          <div className="flex items-center gap-2">
            {item.category}
            {(item.level === 0 || item.level === 1) && ( // Only show chevron for collapsible parents
              <div className={cn("ml-auto h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
            )}
          </div>
        </div>
        <div className="text-right text-gray-700">
          {item.current !== undefined ? formatCurrency(item.current) : "-"}
        </div>
        <div className="text-right text-gray-700">
          {item.previous !== undefined ? formatCurrency(item.previous) : "-"}
        </div>
        <div className="text-right">
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
        </div>
        <div className="text-right">
          {item.variancePercent !== undefined ? (
            <div
              className={cn("text-xs rounded-full px-2 py-0.5", variancePercentNegative && "bg-red-100 text-red-600")}
            >
              {formatPercent(item.variancePercent)}
            </div>
          ) : (
            "-"
          )}
        </div>
        <div>
          {item.segment ? (
            <div className="rounded-full px-2 py-0.5 bg-apple-gray-100 text-gray-600 border-gray-200">
              {item.segment}
            </div>
          ) : (
            "-"
          )}
        </div>
        <div className="max-w-xs truncate text-gray-700">{item.aiExplanation || "-"}</div>
      </>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Variance Analysis</h1>
            <p className="text-lg text-gray-600 mt-1">Financial metrics analysis and line item breakdown</p>
          </div>
        </div>
        <Button className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask AI
        </Button>
      </div>

      {/* Metric Selection */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle>Select Metrics to Analyze</CardTitle>
          <CardDescription>Choose which financial metrics you want to compare between quarters</CardDescription>
        </CardHeader>
        <CardContent>
          <MetricMultiSelect selectedMetrics={selectedMetrics} onMetricsChange={setSelectedMetrics} />
        </CardContent>
      </Card>

      {/* Variance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVariances.map((variance) => {
          const calc = calculateVariance(variance.current, variance.previous)
          return (
            <Card key={variance.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{variance.name}</CardTitle>
                {calc.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{currentQuarter}:</span>
                    <span className="font-semibold">
                      {variance.format === "currency"
                        ? formatCurrency(variance.current)
                        : formatPercentage(variance.current)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{previousQuarter}:</span>
                    <span className="font-semibold">
                      {variance.format === "currency"
                        ? formatCurrency(variance.previous)
                        : formatPercentage(variance.previous)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Change:</span>
                      <div className="text-right">
                        <div className={`font-semibold ${calc.isPositive ? "text-green-600" : "text-red-600"}`}>
                          {calc.isPositive ? "+" : ""}
                          {variance.format === "currency"
                            ? formatCurrency(calc.absolute)
                            : `${calc.absolute.toFixed(2)}%`}
                        </div>
                        <div className={`text-xs ${calc.isPositive ? "text-green-600" : "text-red-600"}`}>
                          ({calc.isPositive ? "+" : ""}
                          {calc.percentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Insights */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">AI-Generated Insights</CardTitle>
          <CardDescription className="text-gray-600">
            Key drivers and explanations for the observed variances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Positive Drivers</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Net Interest Income increased by $70M (+2.5%) due to favorable rate environment</li>
                <li>• Net Interest Margin expanded by 7 basis points to 3.45%</li>
                <li>• Return on Equity improved by 70 basis points to 12.8%</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Areas of Attention</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Loan Loss Provisions increased by $15M (+9.1%) - monitor credit trends</li>
                <li>• Efficiency ratio improvement slowed compared to previous quarters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Item Analysis Table */}
      <Card className="shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Line Item Analysis</CardTitle>
          <CardDescription className="text-gray-600">
            Click on any row to view detailed driver breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderableData.map((item) => {
              const isParent = item.level !== 2
              const isExpanded = expandedRows.has(item.id)

              return (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center justify-between space-x-4">{renderCells(item, isExpanded)}</div>
                  {isExpanded && (
                    <div className="space-y-4">
                      {item.drivers && item.drivers.length > 0 && (
                        <div className="shadow-md rounded-xl border-none">
                          <div className="pb-2">
                            <div className="font-semibold text-sm text-gray-600">Key Drivers</div>
                          </div>
                          <div className="space-y-2 text-gray-700">
                            {item.drivers.map((driver, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span>{driver.name}</span>
                                <span
                                  className={cn(
                                    driver.impact === "positive" && "text-green-600",
                                    driver.impact === "negative" && "text-red-600",
                                    driver.impact === "neutral" && "text-gray-500",
                                  )}
                                >
                                  {driver.impact === "positive" && "+"}
                                  {driver.impact === "negative" && "-"}
                                  {formatCurrency(driver.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.relatedMetrics && item.relatedMetrics.length > 0 && (
                        <div className="shadow-md rounded-xl border-none">
                          <div className="pb-2">
                            <div className="font-semibold text-sm text-gray-600">Related Metrics</div>
                          </div>
                          <div className="space-y-2 text-gray-700">
                            {item.relatedMetrics.map((metricId) => {
                              const metric = financialRatios.find((r) => r.id === metricId)
                              if (metric) {
                                return (
                                  <div key={metric.id} className="flex justify-between items-start">
                                    <span className="font-medium">{metric.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">{metric.description}</span>
                                  </div>
                                )
                              } else {
                                return (
                                  <div key={metricId} className="flex justify-between items-start">
                                    <span className="font-medium">{metricId}</span>
                                    <span className="text-sm text-gray-500 ml-2">(Metric details not available)</span>
                                  </div>
                                )
                              }
                            })}
                          </div>
                        </div>
                      )}

                      {item.newsArticles && item.newsArticles.length > 0 && (
                        <div className="shadow-md rounded-xl border-none">
                          <div className="pb-2">
                            <div className="font-semibold text-sm text-gray-600">Relevant News</div>
                          </div>
                          <div className="space-y-2 text-gray-700">
                            {item.newsArticles.map((article, index) => (
                              <div key={index}>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-apple-blue-600 hover:underline text-sm"
                                >
                                  {article.title}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
