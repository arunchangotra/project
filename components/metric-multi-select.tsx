"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const metrics = [
  { value: "net-interest-income", label: "Net Interest Income" },
  { value: "non-interest-income", label: "Non-Interest Income" },
  { value: "total-revenue", label: "Total Revenue" },
  { value: "net-income", label: "Net Income" },
  { value: "loan-loss-provisions", label: "Loan Loss Provisions" },
  { value: "net-interest-margin", label: "Net Interest Margin" },
  { value: "return-on-equity", label: "Return on Equity" },
  { value: "return-on-assets", label: "Return on Assets" },
  { value: "efficiency-ratio", label: "Efficiency Ratio" },
  { value: "tier1-capital-ratio", label: "Tier 1 Capital Ratio" },
]

interface MetricMultiSelectProps {
  selectedMetrics: string[]
  onMetricsChange: (metrics: string[]) => void
}

export function MetricMultiSelect({ selectedMetrics, onMetricsChange }: MetricMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (metricValue: string) => {
    if (selectedMetrics.includes(metricValue)) {
      onMetricsChange(selectedMetrics.filter((m) => m !== metricValue))
    } else {
      onMetricsChange([...selectedMetrics, metricValue])
    }
  }

  const selectedLabels = metrics
    .filter((metric) => selectedMetrics.includes(metric.value))
    .map((metric) => metric.label)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] p-2 bg-transparent"
          >
            <div className="flex flex-wrap gap-1">
              {selectedLabels.length === 0 ? (
                <span className="text-gray-500">Select metrics to compare...</span>
              ) : (
                selectedLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search metrics..." />
            <CommandList>
              <CommandEmpty>No metrics found.</CommandEmpty>
              <CommandGroup>
                {metrics.map((metric) => (
                  <CommandItem key={metric.value} value={metric.value} onSelect={() => handleSelect(metric.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedMetrics.includes(metric.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {metric.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
