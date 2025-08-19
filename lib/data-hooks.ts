"use client"

import { useState, useEffect } from "react"
import { csvDataService, type ProcessedLineItem, type FilterOptions } from "./csv-data-service"

export function useCSVData() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await csvDataService.loadData()
        setIsLoaded(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    if (!csvDataService.isDataLoaded()) {
      loadData()
    } else {
      setIsLoaded(true)
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, isLoaded }
}

export function useFilteredLineItems(filters: Partial<FilterOptions>) {
  const [data, setData] = useState<ProcessedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isLoaded } = useCSVData()

  useEffect(() => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      const filteredData = csvDataService.getFilteredData(filters)
      setData(filteredData)
    } catch (error) {
      console.error("Error filtering data:", error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [filters, isLoaded])

  return { data, isLoading }
}

export function useFilterOptions() {
  const [options, setOptions] = useState({
    banks: [] as string[],
    categories: [] as string[],
    periods: [] as string[],
    items: [] as string[],
  })
  const { isLoaded } = useCSVData()

  useEffect(() => {
    if (!isLoaded) return

    setOptions({
      banks: csvDataService.getAvailableBanks(),
      categories: csvDataService.getAvailableCategories(),
      periods: csvDataService.getAvailablePeriods(),
      items: csvDataService.getAvailableItems(),
    })
  }, [isLoaded])

  return options
}

export function useBankMetrics(banks: string[], metricIds: string[]) {
  const [metrics, setMetrics] = useState<Record<string, Record<string, number>>>({})
  const { isLoaded } = useCSVData()

  useEffect(() => {
    if (!isLoaded || !banks.length || !metricIds.length) return

    const bankMetrics: Record<string, Record<string, number>> = {}

    banks.forEach((bank) => {
      bankMetrics[bank] = csvDataService.getBankMetrics(bank, metricIds)
    })

    setMetrics(bankMetrics)
  }, [banks, metricIds, isLoaded])

  return metrics
}

export function useHistoricalData(bank: string, metricIds: string[]) {
  const [data, setData] = useState<Record<string, Array<{ quarter: string; value: number }>>>({})
  const { isLoaded } = useCSVData()

  useEffect(() => {
    if (!isLoaded || !bank || !metricIds.length) return

    const historicalData: Record<string, Array<{ quarter: string; value: number }>> = {}

    metricIds.forEach((metricId) => {
      historicalData[metricId] = csvDataService.getHistoricalData(bank, metricId)
    })

    setData(historicalData)
  }, [bank, metricIds, isLoaded])

  return data
}
