"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface MetricOption {
  id: string
  label: string
  category?: string
}

interface MetricMultiSelectProps {
  options: MetricOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
}

export function MetricMultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select metrics...",
}: MetricMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    onSelectionChange(newSelection)
  }

  const selectedLabels = options.filter((option) => selectedValues.includes(option.id)).map((option) => option.label)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-left font-normal bg-transparent">
          <span className="truncate">
            {selectedLabels.length > 0
              ? selectedLabels.length === 1
                ? selectedLabels[0]
                : `${selectedLabels.length} metrics selected`
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="max-h-64 overflow-y-auto">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 p-3 hover:bg-gray-50">
              <Checkbox
                id={option.id}
                checked={selectedValues.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
              />
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {option.label}
                {option.category && <span className="text-xs text-gray-500 block">{option.category}</span>}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
