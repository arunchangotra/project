// CSV Data Service for ADIB financial data
export interface CSVDataRow {
  id: string
  q1_t: string
  q1_t_minus_1: string
  q2_t_minus_1: string
  q3_t_minus_1: string
  f_t_minus_1: string
  q1_t_minus_2: string
  q2_t_minus_2: string
  q3_t_minus_2: string
  f_t_minus_2: string
}

export interface ProcessedLineItem {
  id: string
  item: string
  bank: string
  category: string
  segment: string
  level: number
  current: number | undefined
  previous: number | undefined
  variance: number | undefined
  variancePercent: number | undefined
  _prefix?: string
}

// Item ID to readable name mapping
const ITEM_ID_MAPPING: Record<string, { name: string; category: string; segment: string; level: number }> = {
  "1": { name: "Net Interest Income", category: "P&L", segment: "Revenue", level: 0 },
  "2": { name: "Interest Income", category: "P&L", segment: "Revenue", level: 1 },
  "3": { name: "Interest Expense", category: "P&L", segment: "Revenue", level: 1 },
  "4": { name: "Non-Interest Income", category: "P&L", segment: "Revenue", level: 0 },
  "5": { name: "Fee and Commission Income", category: "P&L", segment: "Revenue", level: 1 },
  "6": { name: "Trading Income", category: "P&L", segment: "Revenue", level: 1 },
  "7": { name: "Other Operating Income", category: "P&L", segment: "Revenue", level: 1 },
  "8": { name: "Total Operating Income", category: "P&L", segment: "Revenue", level: 0 },
  "9": { name: "Operating Expenses", category: "P&L", segment: "Expenses", level: 0 },
  "10": { name: "Staff Costs", category: "P&L", segment: "Expenses", level: 1 },
  "11": { name: "Other Operating Expenses", category: "P&L", segment: "Expenses", level: 1 },
  "12": { name: "Depreciation", category: "P&L", segment: "Expenses", level: 1 },
  "13": { name: "Impairment Charges", category: "P&L", segment: "Risk", level: 0 },
  "14": { name: "Profit Before Tax", category: "P&L", segment: "Profitability", level: 0 },
  "15": { name: "Tax Expense", category: "P&L", segment: "Profitability", level: 1 },
  "16": { name: "Net Profit", category: "P&L", segment: "Profitability", level: 0 },
  "17": { name: "Total Assets", category: "Balance Sheet", segment: "Assets", level: 0 },
  "18": { name: "Loans and Advances", category: "Balance Sheet", segment: "Assets", level: 1 },
  "19": { name: "Investment Securities", category: "Balance Sheet", segment: "Assets", level: 1 },
  "20": { name: "Cash and Bank Balances", category: "Balance Sheet", segment: "Assets", level: 1 },
}

class CSVDataService {
  private static instance: CSVDataService
  private csvData: CSVDataRow[] | null = null
  private processedData: ProcessedLineItem[] | null = null
  private isLoading = false

  static getInstance(): CSVDataService {
    if (!CSVDataService.instance) {
      CSVDataService.instance = new CSVDataService()
    }
    return CSVDataService.instance
  }

  async fetchCSVData(): Promise<CSVDataRow[]> {
    if (this.csvData) {
      return this.csvData
    }

    if (this.isLoading) {
      // Wait for existing request
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return this.csvData || []
    }

    this.isLoading = true

    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adib_csv-NnJWhpVRJafi03oUOvKnAwYIuMmOzx.csv",
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const csvText = await response.text()
      const rows = csvText.split("\n").filter((row) => row.trim())

      // Skip header row and process data
      const dataRows = rows
        .slice(1)
        .map((row) => {
          const columns = row.split(",").map((col) => col.trim().replace(/"/g, ""))
          return {
            id: columns[0] || "",
            q1_t: columns[1] || "na",
            q1_t_minus_1: columns[2] || "na",
            q2_t_minus_1: columns[3] || "na",
            q3_t_minus_1: columns[4] || "na",
            f_t_minus_1: columns[5] || "na",
            q1_t_minus_2: columns[6] || "na",
            q2_t_minus_2: columns[7] || "na",
            q3_t_minus_2: columns[8] || "na",
            f_t_minus_2: columns[9] || "na",
          }
        })
        .filter((row) => row.id && ITEM_ID_MAPPING[row.id])

      this.csvData = dataRows
      return this.csvData
    } catch (error) {
      console.error("Error fetching CSV data:", error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  private parseValue(value: string): number | undefined {
    if (value === "na" || value === "" || value === undefined) {
      return undefined
    }
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  async getProcessedLineItems(): Promise<ProcessedLineItem[]> {
    if (this.processedData) {
      return this.processedData
    }

    const csvData = await this.fetchCSVData()

    this.processedData = csvData.map((row) => {
      const itemInfo = ITEM_ID_MAPPING[row.id]
      const current = this.parseValue(row.q1_t)
      const previous = this.parseValue(row.q1_t_minus_1)

      let variance: number | undefined
      let variancePercent: number | undefined

      if (current !== undefined && previous !== undefined) {
        variance = current - previous
        variancePercent = previous !== 0 ? (variance / previous) * 100 : 0
      }

      return {
        id: `item-${row.id}`,
        item: itemInfo.name,
        bank: "ADIB",
        category: itemInfo.category,
        segment: itemInfo.segment,
        level: itemInfo.level,
        current,
        previous,
        variance,
        variancePercent,
        _prefix: row.id,
      }
    })

    return this.processedData
  }

  async getFilterOptions() {
    const data = await this.getProcessedLineItems()

    const banks = [...new Set(data.map((item) => item.bank))]
    const categories = [...new Set(data.map((item) => item.category))]
    const segments = [...new Set(data.map((item) => item.segment))]
    const periods = ["q1_t", "q1_t_minus_1", "q2_t_minus_1", "q3_t_minus_1", "f_t_minus_1"]

    return {
      banks,
      categories,
      segments,
      periods,
    }
  }

  async getHistoricalData(bank: string, metricIds: string[]) {
    const csvData = await this.fetchCSVData()
    const historicalData: Record<string, any[]> = {}

    // Map metric IDs to CSV row IDs
    const metricToRowMap: Record<string, string> = {
      NIM: "1",
      ROE: "16",
      ROA: "16",
      ER: "9",
      CAR: "17",
    }

    metricIds.forEach((metricId) => {
      const rowId = metricToRowMap[metricId]
      if (rowId) {
        const row = csvData.find((r) => r.id === rowId)
        if (row) {
          historicalData[metricId] = [
            { quarter: "Q1 2023", value: this.parseValue(row.q1_t_minus_2) },
            { quarter: "Q2 2023", value: this.parseValue(row.q2_t_minus_2) },
            { quarter: "Q3 2023", value: this.parseValue(row.q3_t_minus_2) },
            { quarter: "Q1 2024", value: this.parseValue(row.q1_t) },
          ].filter((item) => item.value !== undefined)
        }
      }
    })

    return historicalData
  }

  async getBankMetrics(banks: string[], metricIds: string[]) {
    const csvData = await this.fetchCSVData()
    const bankMetrics: Record<string, Record<string, number>> = {}

    // For now, we only have ADIB data
    if (banks.includes("ADIB")) {
      bankMetrics["ADIB"] = {}

      const metricToRowMap: Record<string, string> = {
        NIM: "1",
        ROE: "16",
        ROA: "16",
        ER: "9",
        CAR: "17",
      }

      metricIds.forEach((metricId) => {
        const rowId = metricToRowMap[metricId]
        if (rowId) {
          const row = csvData.find((r) => r.id === rowId)
          if (row) {
            const value = this.parseValue(row.q1_t)
            if (value !== undefined) {
              bankMetrics["ADIB"][metricId] = value
            }
          }
        }
      })
    }

    return bankMetrics
  }

  clearCache() {
    this.csvData = null
    this.processedData = null
  }
}

export const csvDataService = CSVDataService.getInstance()
