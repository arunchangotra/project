"use client"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { periodFilters } from "@/lib/filter-options"

interface PeriodFilterProps {
  selectedPeriodType: string
  onPeriodTypeChange: (periodType: string) => void
  selectedCurrentPeriod: string
  selectedPreviousPeriod: string
  onCurrentPeriodChange: (period: string) => void
  onPreviousPeriodChange: (period: string) => void
}

export function PeriodFilterComponent({
  selectedPeriodType,
  onPeriodTypeChange,
  selectedCurrentPeriod,
  selectedPreviousPeriod,
  onCurrentPeriodChange,
  onPreviousPeriodChange,
}: PeriodFilterProps) {
  const currentFilter = periodFilters.find((f) => f.id === selectedPeriodType)

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

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Calendar className="h-4 w-4" />
        <span>Period:</span>
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedPeriodType} onValueChange={onPeriodTypeChange}>
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodFilters.map((filter) => (
              <SelectItem key={filter.id} value={filter.id}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCurrentPeriod} onValueChange={onCurrentPeriodChange} disabled={!currentFilter}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue placeholder="Current" />
          </SelectTrigger>
          <SelectContent>
            {currentFilter?.periods.map((period) => (
              <SelectItem key={period} value={period}>
                {formatPeriodLabel(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-gray-500">vs</span>

        <Select value={selectedPreviousPeriod} onValueChange={onPreviousPeriodChange} disabled={!currentFilter}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue placeholder="Previous" />
          </SelectTrigger>
          <SelectContent>
            {currentFilter?.periods.map((period) => (
              <SelectItem key={period} value={period}>
                {formatPeriodLabel(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="bg-amber-900 text-white hover:bg-amber-800 border-amber-900 h-8 px-3 text-xs"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
