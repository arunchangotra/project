"use client"

import { useState, useEffect } from "react"
import { csvDataService, type ProcessedLineItem } from "./csv-data-service"

interface FilterOptions {
  banks: string[]
  categories: string[]
  periods: string[]
  segments: string[]
  isLoading: boolean
  error: string | null
}

interface DataFilters {
  banks?: string[]
  categories?: string[]
  periods?: string[]
  segments?: string[]
}

export function useFilterOptions(): FilterOptions {
  const [options, setOptions] = useState<FilterOptions>({
    banks: [],
    categories: [],
    periods: [],
    segments: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        await csvDataService.fetchCSVData()
        const filterOptions = csvDataService.getFilterOptions()

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

export function useFilteredLineItems(filters: DataFilters) {
  const [data, setData] = useState<ProcessedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await csvDataService.fetchCSVData()
        const filteredData = csvDataService.filterData(filters)
        setData(filteredData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load line items")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [filters.banks?.join(","), filters.categories?.join(","), filters.periods?.join(","), filters.segments?.join(",")])

  return { data, isLoading, error }
}

export function useHistoricalData(bank: string, itemIds: string[]) {
  const [data, setData] = useState<Record<string, Array<{ quarter: string; value: number }>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!bank || itemIds.length === 0) {
        setData({})
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await csvDataService.fetchCSVData()
        const historicalData = csvDataService.getHistoricalData(bank, itemIds)
        setData(historicalData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load historical data")
        setData({})
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [bank, itemIds.join(",")])

  return { data, isLoading, error }
}

export function useBankMetrics(banks: string[], metricIds: string[]) {
  const [data, setData] = useState<Record<string, Record<string, number>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (banks.length === 0 || metricIds.length === 0) {
        setData({})
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await csvDataService.fetchCSVData()
        const result: Record<string, Record<string, number>> = {}

        banks.forEach((bank) => {
          result[bank] = {}

          // Map metric IDs to item IDs from CSV
          const metricToItemMap: Record<string, string> = {
            NIM: "20", // Net Interest Margin
            ROA: "18", // Return on Assets
            ROE: "19", // Return on Equity
            ER: "9", // Efficiency Ratio (using Total Operating Expenses)
            CAR: "17", // Capital Adequacy (using Total Equity as proxy)
            CET1: "17", // CET1 (using Total Equity as proxy)
            NPLR: "11", // NPL Ratio (using Impairment Charges as proxy)
            LDR: "15", // Loan to Deposit Ratio (using Loans and Advances)
            PER: "13", // Price Earnings Ratio (using Net Profit as proxy)
          }

          metricIds.forEach((metricId) => {
            const itemId = metricToItemMap[metricId]
            if (itemId) {
              const historicalData = csvDataService.getHistoricalData(bank, [itemId])
              const latestData = historicalData[itemId]?.[0] // Get most recent data
              if (latestData) {
                result[bank][metricId] = latestData.value
              }
            }
          })
        })

        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bank metrics")
        setData({})
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [banks.join(","), metricIds.join(",")])

  return { data, isLoading, error }
}
