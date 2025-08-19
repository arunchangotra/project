"use client"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="h-4 w-4" />
          Period Filter Which Column?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Period Type</label>
            <Select value={selectedPeriodType} onValueChange={onPeriodTypeChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select period type" />
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

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Current Period</label>
            <Select value={selectedCurrentPeriod} onValueChange={onCurrentPeriodChange} disabled={!currentFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select current period" />
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

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Previous Period</label>
            <Select value={selectedPreviousPeriod} onValueChange={onPreviousPeriodChange} disabled={!currentFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select previous period" />
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
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-amber-900 text-white hover:bg-amber-800 border-amber-900">
            Column C filter
          </Button>
          <Button variant="outline" size="sm" className="bg-amber-900 text-white hover:bg-amber-800 border-amber-900">
            Column D filter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
