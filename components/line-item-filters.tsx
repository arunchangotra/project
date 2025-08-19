"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, Settings, Calendar, Building2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  bankFilterOptions,
  categoryFilterOptions,
  columnFilterOptions,
  periodFilterOptions,
} from "@/lib/line-item-data"

interface LineItemFiltersProps {
  selectedBanks: string[]
  selectedCategories: string[]
  selectedPeriods: string[]
  selectedColumns: string[]
  onBanksChange: (banks: string[]) => void
  onCategoriesChange: (categories: string[]) => void
  onPeriodsChange: (periods: string[]) => void
  onColumnsChange: (columns: string[]) => void
}

export function LineItemFilters({
  selectedBanks,
  selectedCategories,
  selectedPeriods,
  selectedColumns,
  onBanksChange,
  onCategoriesChange,
  onPeriodsChange,
  onColumnsChange,
}: LineItemFiltersProps) {
  const [columnFilterOpen, setColumnFilterOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false)
  const [periodFilterOpen, setPeriodFilterOpen] = useState(false)

  const toggleBank = (bankValue: string) => {
    const newSelection = selectedBanks.includes(bankValue)
      ? selectedBanks.filter((b) => b !== bankValue)
      : [...selectedBanks, bankValue]
    onBanksChange(newSelection)
  }

  const toggleCategory = (categoryValue: string) => {
    const newSelection = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((c) => c !== categoryValue)
      : [...selectedCategories, categoryValue]
    onCategoriesChange(newSelection)
  }

  const togglePeriod = (periodValue: string) => {
    const newSelection = selectedPeriods.includes(periodValue)
      ? selectedPeriods.filter((p) => p !== periodValue)
      : [...selectedPeriods, periodValue]
    onPeriodsChange(newSelection)
  }

  const toggleColumn = (columnValue: string) => {
    const newSelection = selectedColumns.includes(columnValue)
      ? selectedColumns.filter((c) => c !== columnValue)
      : [...selectedColumns, columnValue]
    onColumnsChange(newSelection)
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4 text-apple-blue-600" />
          <span>Line Item Analysis Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Buttons Row */}
        <div className="flex flex-wrap gap-2">
          {/* Column & Filter Button */}
          <Popover open={columnFilterOpen} onOpenChange={setColumnFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-amber-900 hover:bg-amber-800 text-white h-8 px-4 text-xs font-medium"
              >
                <Settings className="h-3 w-3 mr-1" />
                Column & Filter
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Select Columns</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {columnFilterOptions.map((column) => (
                    <div key={column.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.value}
                        checked={selectedColumns.includes(column.value)}
                        onCheckedChange={() => toggleColumn(column.value)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={column.value} className="text-xs text-gray-700 cursor-pointer flex-1">
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Category Filter */}
          <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-amber-900 hover:bg-amber-800 text-white h-8 px-4 text-xs font-medium"
              >
                Category
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Categories</h4>
                <div className="space-y-2">
                  {categoryFilterOptions.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={category.value} className="text-xs text-gray-700 cursor-pointer flex-1">
                        {category.label}
                        <span className="text-gray-500 ml-1">({category.count})</span>
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
                className="bg-amber-900 hover:bg-amber-800 text-white h-8 px-4 text-xs font-medium"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Period Filter
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Time Periods</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {periodFilterOptions.map((period) => (
                    <div key={period.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={period.value}
                        checked={selectedPeriods.includes(period.value)}
                        onCheckedChange={() => togglePeriod(period.value)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={period.value} className="text-xs text-gray-700 cursor-pointer flex-1">
                        {period.label}
                        <Badge variant="outline" className="ml-1 text-xs px-1 py-0 h-4">
                          {period.type}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bank Filter Button */}
          <Button
            variant="default"
            size="sm"
            className="bg-amber-900 hover:bg-amber-800 text-white h-8 px-4 text-xs font-medium"
          >
            <Building2 className="h-3 w-3 mr-1" />
            Bank Filter
          </Button>
        </div>

        {/* Bank Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          {bankFilterOptions.map((bank) => (
            <Button
              key={bank.value}
              variant={selectedBanks.includes(bank.value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBank(bank.value)}
              className={cn(
                "h-8 px-4 text-xs font-medium transition-all",
                selectedBanks.includes(bank.value)
                  ? `${bank.color} text-white hover:opacity-90`
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
              )}
            >
              {bank.label}
            </Button>
          ))}
        </div>

        {/* Active Filters Summary */}
        {(selectedBanks.length > 0 || selectedCategories.length > 0 || selectedPeriods.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-600 font-medium">Active Filters:</span>
            {selectedBanks.map((bank) => (
              <Badge key={bank} variant="secondary" className="text-xs px-2 py-0.5">
                {bank}
              </Badge>
            ))}
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs px-2 py-0.5">
                {category}
              </Badge>
            ))}
            {selectedPeriods.map((period) => (
              <Badge key={period} variant="secondary" className="text-xs px-2 py-0.5">
                {periodFilterOptions.find((p) => p.value === period)?.label}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onBanksChange([])
                onCategoriesChange([])
                onPeriodsChange([])
              }}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
