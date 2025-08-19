"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
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
  className,
}: MetricMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  // Ensure we have valid metrics data
  const metrics = React.useMemo(() => {
    return Array.isArray(financialRatios) ? financialRatios : []
  }, [])

  const handleSelect = React.useCallback(
    (metricId: string) => {
      const newSelected = [...selectedMetrics]
      const index = newSelected.indexOf(metricId)

      if (index > -1) {
        // Remove if already selected
        newSelected.splice(index, 1)
      } else if (newSelected.length < maxSelection) {
        // Add if under limit
        newSelected.push(metricId)
      }

      onMetricsChange(newSelected)
    },
    [selectedMetrics, onMetricsChange, maxSelection],
  )

  const filteredMetrics = React.useMemo(() => {
    if (!searchTerm || !Array.isArray(metrics)) return metrics

    const lowerSearchTerm = searchTerm.toLowerCase()
    return metrics.filter(
      (metric) =>
        metric?.name?.toLowerCase().includes(lowerSearchTerm) ||
        metric?.id?.toLowerCase().includes(lowerSearchTerm) ||
        metric?.category?.toLowerCase().includes(lowerSearchTerm),
    )
  }, [metrics, searchTerm])

  const selectedMetricNames = React.useMemo(() => {
    return selectedMetrics.map((id) => metrics.find((m) => m?.id === id)?.name || id).filter(Boolean)
  }, [selectedMetrics, metrics])

  if (!Array.isArray(metrics) || metrics.length === 0) {
    return (
      <Button variant="outline" className={cn("w-full justify-between rounded-lg border-gray-300", className)} disabled>
        No metrics available
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500",
            className,
          )}
        >
          {selectedMetrics.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {selectedMetricNames.slice(0, 2).map((name, index) => (
                <Badge key={index} variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                  {name}
                </Badge>
              ))}
              {selectedMetrics.length > 2 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                  +{selectedMetrics.length - 2} more
                </Badge>
              )}
            </div>
          ) : (
            "Select metrics..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 rounded-lg shadow-md">
        <Command>
          <CommandInput placeholder="Search metrics..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>No metrics found.</CommandEmpty>
            <CommandGroup>
              {filteredMetrics.map((metric) => {
                if (!metric?.id || !metric?.name) return null

                const isSelected = selectedMetrics.includes(metric.id)
                const isDisabled = !isSelected && selectedMetrics.length >= maxSelection

                return (
                  <CommandItem
                    key={metric.id}
                    value={metric.name}
                    onSelect={() => !isDisabled && handleSelect(metric.id)}
                    disabled={isDisabled}
                    className={cn(isDisabled && !isSelected && "opacity-50 cursor-not-allowed")}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span>{metric.name}</span>
                      {metric.unit && <span className="text-xs text-gray-500">({metric.unit})</span>}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
