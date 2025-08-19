"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { financialRatios } from "@/lib/financial-ratios"

interface MetricMultiSelectProps {
  selectedMetrics: string[]
  onMetricsChange: (metrics: string[]) => void
  maxSelection?: number
  className?: string
}

export function MetricMultiSelect({
  selectedMetrics = [],
  onMetricsChange,
  maxSelection = 5,
  className = "",
}: MetricMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Safe array handling
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : []
  const safeFinancialRatios = Array.isArray(financialRatios) ? financialRatios : []

  const toggleMetric = (metricId: string) => {
    if (!metricId || typeof onMetricsChange !== "function") return

    const currentMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : []

    if (currentMetrics.includes(metricId)) {
      onMetricsChange(currentMetrics.filter((id) => id !== metricId))
    } else if (currentMetrics.length < maxSelection) {
      onMetricsChange([...currentMetrics, metricId])
    }
  }

  const removeMetric = (metricId: string) => {
    if (!metricId || typeof onMetricsChange !== "function") return

    const currentMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : []
    onMetricsChange(currentMetrics.filter((id) => id !== metricId))
  }

  const clearAll = () => {
    if (typeof onMetricsChange === "function") {
      onMetricsChange([])
    }
  }

  // Group metrics by category for better organization
  const groupedMetrics = safeFinancialRatios.reduce(
    (acc, metric) => {
      if (!metric || !metric.category) return acc

      if (!acc[metric.category]) {
        acc[metric.category] = []
      }
      acc[metric.category].push(metric)
      return acc
    },
    {} as Record<string, typeof financialRatios>,
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Selected Metrics Display */}
      {safeSelectedMetrics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {safeSelectedMetrics.map((metricId) => {
            const metric = safeFinancialRatios.find((m) => m && m.id === metricId)
            return (
              <Badge
                key={metricId}
                variant="secondary"
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {metric?.name || metricId}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMetric(metricId)
                  }}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Metric Selection Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-between h-9 px-3 text-sm bg-transparent">
            <span>
              {safeSelectedMetrics.length > 0
                ? `${safeSelectedMetrics.length} metric${safeSelectedMetrics.length > 1 ? "s" : ""} selected`
                : "Select metrics"}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-900">Select Metrics</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {safeSelectedMetrics.length}/{maxSelection}
                </span>
                {safeSelectedMetrics.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3">
              {Object.keys(groupedMetrics).length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">No metrics available</div>
              ) : (
                Object.entries(groupedMetrics).map(([category, metrics]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">{category}</h5>
                    <div className="space-y-1">
                      {Array.isArray(metrics) &&
                        metrics.map((metric) => {
                          if (!metric || !metric.id) return null

                          const isSelected = safeSelectedMetrics.includes(metric.id)
                          const isDisabled = !isSelected && safeSelectedMetrics.length >= maxSelection

                          return (
                            <div
                              key={metric.id}
                              className={cn(
                                "flex items-center space-x-2 p-2 rounded hover:bg-gray-50",
                                isDisabled && "opacity-50 cursor-not-allowed",
                              )}
                            >
                              <Checkbox
                                id={metric.id}
                                checked={isSelected}
                                onCheckedChange={() => !isDisabled && toggleMetric(metric.id)}
                                disabled={isDisabled}
                                className="h-4 w-4"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={metric.id}
                                  className={cn(
                                    "text-sm cursor-pointer block",
                                    isDisabled ? "text-gray-400" : "text-gray-700",
                                  )}
                                >
                                  <div className="font-medium">{metric.name}</div>
                                  {metric.description && (
                                    <div className="text-xs text-gray-500 truncate">{metric.description}</div>
                                  )}
                                </label>
                              </div>
                              {metric.unit && <span className="text-xs text-gray-400 font-mono">{metric.unit}</span>}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {safeSelectedMetrics.length >= maxSelection && (
              <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Maximum {maxSelection} metrics can be selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
