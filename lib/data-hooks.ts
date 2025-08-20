"use client"

import { useState, useEffect } from "react"
import { csvDataService, type ProcessedLineItem, type FilterOptions } from "./csv-data-service"

export function useFilterOptions() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    banks: [],
    categories: [],
    periods: [],
    items: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const options = await csvDataService.getFilterOptions()

        if (isMounted) {
          setFilterOptions(options)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load filter options")
          console.error("Error loading filter options:", err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchOptions()

    return () => {
      isMounted = false
    }
  }, [])

  return { ...filterOptions, isLoading, error }
}

export function useFilteredLineItems(filters: {
  banks?: string[]
  categories?: string[]
  periods?: string[]
  items?: string[]
}) {
  const [data, setData] = useState<ProcessedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const filteredData = await csvDataService.getFilteredData(filters)

        if (isMounted) {
          setData(filteredData)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load line items")
          console.error("Error loading filtered line items:", err)
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
  }, [JSON.stringify(filters)]) // Use JSON.stringify for deep comparison

  return { data, isLoading, error }
}

export function useHistoricalData(bank: string, metrics: string[]) {
  const [data, setData] = useState<Record<string, Array<{ quarter: string; value: number }>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!bank || !metrics.length) {
        setData({})
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const historicalData = await csvDataService.getHistoricalData(bank, metrics)

        if (isMounted) {
          setData(historicalData)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load historical data")
          console.error("Error loading historical data:", err)
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
  }, [bank, JSON.stringify(metrics)])

  return { data, isLoading, error }
}

export function useBankMetrics(banks: string[], metrics: string[]) {
  const [data, setData] = useState<Record<string, Record<string, number>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!banks.length || !metrics.length) {
        setData({})
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const bankMetrics = await csvDataService.getBankMetrics(banks, metrics)

        if (isMounted) {
          setData(bankMetrics)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load bank metrics")
          console.error("Error loading bank metrics:", err)
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
  }, [JSON.stringify(banks), JSON.stringify(metrics)])

  return { data, isLoading, error }
}
