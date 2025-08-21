"use client"

import { useState, useEffect } from "react"
import { csvDataService, type ProcessedLineItem } from "./csv-data-service"

export interface FilterOptions {
  banks: string[]
  categories: string[]
  segments: string[]
  periods: string[]
  isLoading: boolean
  error: string | null
}

export interface LineItemFilters {
  banks: string[]
  categories: string[]
  periods: string[]
}

export function useFilterOptions(): FilterOptions {
  const [options, setOptions] = useState<FilterOptions>({
    banks: [],
    categories: [],
    segments: [],
    periods: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const filterOptions = await csvDataService.getFilterOptions()
        setOptions({
          ...filterOptions,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setOptions((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load filter options",
        }))
      }
    }

    loadOptions()
  }, [])

  return options
}

export function useFilteredLineItems(filters: LineItemFilters) {
  const [data, setData] = useState<ProcessedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const allItems = await csvDataService.getProcessedLineItems()
        console.log(`Loaded ${allItems.length} items from CSV service`)

        // Apply filters - but be more permissive
        let filteredItems = allItems

        // Only filter by banks if specific banks are selected
        if (filters.banks.length > 0) {
          filteredItems = filteredItems.filter((item) => filters.banks.includes(item.bank))
        }

        // Only filter by categories if specific categories are selected
        if (filters.categories.length > 0) {
          filteredItems = filteredItems.filter((item) => filters.categories.includes(item.category))
        }

        console.log(`Filtered to ${filteredItems.length} items`)
        setData(filteredItems)
      } catch (error) {
        console.error("Error in useFilteredLineItems:", error)
        setError(error instanceof Error ? error.message : "Failed to load line items")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [filters.banks, filters.categories, filters.periods])

  return { data, isLoading, error }
}

export function useHistoricalData(bank: string, metricIds: string[]) {
  const [data, setData] = useState<Record<string, any[]> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!bank || metricIds.length === 0) {
        setData(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const historicalData = await csvDataService.getHistoricalData(bank, metricIds)
        setData(historicalData)
      } catch (error) {
        console.error("Error loading historical data:", error)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [bank, metricIds])

  return { data, isLoading }
}

export function useBankMetrics(banks: string[], metricIds: string[]) {
  const [data, setData] = useState<Record<string, Record<string, number>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (banks.length === 0 || metricIds.length === 0) {
        setData(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const bankMetrics = await csvDataService.getBankMetrics(banks, metricIds)
        setData(bankMetrics)
      } catch (error) {
        console.error("Error loading bank metrics:", error)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [banks, metricIds])

  return { data, isLoading }
}
