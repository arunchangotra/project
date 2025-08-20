"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { FinancialRatio } from "@/lib/financial-ratios"

interface MetricMultiSelectProps {
  metrics: FinancialRatio[]
  selectedMetrics: Set<string>
  onSelectChange: (newSelectedMetrics: Set<string>) => void
}

export function MetricMultiSelect({ metrics, selectedMetrics, onSelectChange }: MetricMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSelect = (metricId: string) => {
    const newSelected = new Set(selectedMetrics)
    if (newSelected.has(metricId)) {
      newSelected.delete(metricId)
    } else {
      newSelected.add(metricId)
    }
    onSelectChange(newSelected)
  }

  const filteredMetrics = React.useMemo(() => {
    if (!searchTerm) return metrics
    const lowerSearchTerm = searchTerm.toLowerCase()
    return metrics.filter(
      (metric) =>
        metric.name.toLowerCase().includes(lowerSearchTerm) ||
        metric.id.toLowerCase().includes(lowerSearchTerm) ||
        metric.category.toLowerCase().includes(lowerSearchTerm),
    )
  }, [metrics, searchTerm])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500"
        >
          {selectedMetrics.size > 0 ? (
            <div className="flex flex-wrap gap-1">
              {Array.from(selectedMetrics).map((metricId) => {
                const metric = metrics.find((m) => m.id === metricId)
                return (
                  <Badge key={metricId} variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                    {metric?.name || metricId}
                  </Badge>
                )
              })}
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
              {filteredMetrics.map((metric) => (
                <CommandItem key={metric.id} value={metric.name} onSelect={() => handleSelect(metric.id)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedMetrics.has(metric.id) ? "opacity-100" : "opacity-0")} />
                  {metric.name} ({metric.unit})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
