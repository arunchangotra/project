"use client"

import { useState, useEffect, useMemo } from "react"
import { csvDataService, type ProcessedLineItem, type FilterOptions } from "./csv-data-service"

export function useCSVData() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await csvDataService.loadData()
        if (isMounted) {
          setIsLoaded(true)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load data")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (!csvDataService.isDataLoaded()) {
      loadData()
    } else {
      setIsLoaded(true)
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [])

  return { isLoading, error, isLoaded }
}

export function useFilteredLineItems(filters: Partial<FilterOptions>) {
  const [data, setData] = useState<ProcessedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isLoaded } = useCSVData()

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [
      Array.isArray(filters.banks) ? filters.banks.join(",") : "",
      Array.isArray(filters.categories) ? filters.categories.join(",") : "",
      Array.isArray(filters.periods) ? filters.periods.join(",") : "",
      Array.isArray(filters.items) ? filters.items.join(",") : "",
    ],
  )

  useEffect(() => {
    if (!isLoaded) return

    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const filteredData = csvDataService.getFilteredData(memoizedFilters)
        if (isMounted) {
          setData(Array.isArray(filteredData) ? filteredData : [])
        }
      } catch (error) {
        console.error("Error filtering data:", error)
        if (isMounted) {
          setData([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [memoizedFilters, isLoaded])

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

    let isMounted = true

    try {
      const newOptions = {
        banks: csvDataService.getAvailableBanks() || [],
        categories: csvDataService.getAvailableCategories() || [],
        periods: csvDataService.getAvailablePeriods() || [],
        items: csvDataService.getAvailableItems() || [],
      }

      if (isMounted) {
        setOptions(newOptions)
      }
    } catch (error) {
      console.error("Error getting filter options:", error)
      if (isMounted) {
        setOptions({
          banks: [],
          categories: [],
          periods: [],
          items: [],
        })
      }
    }

    return () => {
      isMounted = false
    }
  }, [isLoaded])

  return options
}

export function useBankMetrics(banks: string[], metricIds: string[]) {
  const [metrics, setMetrics] = useState<Record<string, Record<string, number>>>({})
  const { isLoaded } = useCSVData()

  // Memoize the dependencies to prevent unnecessary re-renders
  const memoizedBanks = useMemo(() => {
    return Array.isArray(banks) ? banks : []
  }, [Array.isArray(banks) ? banks.join(",") : ""])

  const memoizedMetricIds = useMemo(() => {
    return Array.isArray(metricIds) ? metricIds : []
  }, [Array.isArray(metricIds) ? metricIds.join(",") : ""])

  useEffect(() => {
    if (!isLoaded || !memoizedBanks.length || !memoizedMetricIds.length) {
      setMetrics({})
      return
    }

    let isMounted = true

    try {
      const bankMetrics: Record<string, Record<string, number>> = {}

      memoizedBanks.forEach((bank) => {
        try {
          bankMetrics[bank] = csvDataService.getBankMetrics(bank, memoizedMetricIds) || {}
        } catch (error) {
          console.error(`Error getting metrics for bank ${bank}:`, error)
          bankMetrics[bank] = {}
        }
      })

      if (isMounted) {
        setMetrics(bankMetrics)
      }
    } catch (error) {
      console.error("Error getting bank metrics:", error)
      if (isMounted) {
        setMetrics({})
      }
    }

    return () => {
      isMounted = false
    }
  }, [memoizedBanks, memoizedMetricIds, isLoaded])

  return metrics
}

export function useHistoricalData(bank: string, metricIds: string[]) {
  const [data, setData] = useState<Record<string, Array<{ quarter: string; value: number }>>>({})
  const { isLoaded } = useCSVData()

  // Memoize the dependencies to prevent unnecessary re-renders
  const memoizedMetricIds = useMemo(() => {
    return Array.isArray(metricIds) ? metricIds : []
  }, [Array.isArray(metricIds) ? metricIds.join(",") : ""])

  useEffect(() => {
    if (!isLoaded || !bank || !memoizedMetricIds.length) {
      setData({})
      return
    }

    let isMounted = true

    try {
      const historicalData: Record<string, Array<{ quarter: string; value: number }>> = {}

      memoizedMetricIds.forEach((metricId) => {
        try {
          historicalData[metricId] = csvDataService.getHistoricalData(bank, metricId) || []
        } catch (error) {
          console.error(`Error getting historical data for ${bank} - ${metricId}:`, error)
          historicalData[metricId] = []
        }
      })

      if (isMounted) {
        setData(historicalData)
      }
    } catch (error) {
      console.error("Error getting historical data:", error)
      if (isMounted) {
        setData({})
      }
    }

    return () => {
      isMounted = false
    }
  }, [bank, memoizedMetricIds, isLoaded])

  return data
}
