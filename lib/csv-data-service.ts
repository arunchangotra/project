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
  category: string
  bank: string
  level: number
  currentValue: number | null
  previousValue: number | null
  variance: number | null
  variancePercent: number | null
  q1_current: number | null
  q1_previous: number | null
  q2_previous: number | null
  q3_previous: number | null
  full_year_previous: number | null
  segment?: string
  subCategory?: string
}

export interface FilterOptions {
  banks: string[]
  categories: string[]
  periods: string[]
  items: string[]
}

class CSVDataService {
  private csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adib_csv-NnJWhpVRJafi03oUOvKnAwYIuMmOzx.csv"
  private cachedData: ProcessedLineItem[] | null = null
  private filterOptions: FilterOptions | null = null

  // Item ID to readable name mapping
  private itemNameMapping: Record<string, { name: string; category: string; level: number; segment?: string }> = {
    "1": { name: "Net Interest Income", category: "P&L", level: 0, segment: "Revenue" },
    "2": { name: "Non-Interest Income", category: "P&L", level: 0, segment: "Revenue" },
    "3": { name: "Total Operating Income", category: "P&L", level: 0, segment: "Revenue" },
    "4": { name: "Operating Expenses", category: "P&L", level: 0, segment: "Expenses" },
    "5": { name: "Operating Profit", category: "P&L", level: 0, segment: "Profitability" },
    "6": { name: "Impairment Charges", category: "P&L", level: 0, segment: "Risk" },
    "7": { name: "Profit Before Tax", category: "P&L", level: 0, segment: "Profitability" },
    "8": { name: "Tax Expense", category: "P&L", level: 0, segment: "Tax" },
    "9": { name: "Net Profit", category: "P&L", level: 0, segment: "Profitability" },
    "10": { name: "Total Assets", category: "Balance Sheet", level: 0, segment: "Assets" },
    "11": { name: "Customer Deposits", category: "Balance Sheet", level: 0, segment: "Liabilities" },
    "12": { name: "Loans and Advances", category: "Balance Sheet", level: 0, segment: "Assets" },
    "13": { name: "Shareholders' Equity", category: "Balance Sheet", level: 0, segment: "Equity" },
    "14": { name: "Return on Assets (ROA)", category: "KPI", level: 0, segment: "Profitability" },
    "15": { name: "Return on Equity (ROE)", category: "KPI", level: 0, segment: "Profitability" },
    "16": { name: "Net Interest Margin (NIM)", category: "KPI", level: 0, segment: "Efficiency" },
    "17": { name: "Cost to Income Ratio", category: "KPI", level: 0, segment: "Efficiency" },
    "18": { name: "Capital Adequacy Ratio", category: "Ratios", level: 0, segment: "Capital" },
    "19": { name: "Tier 1 Capital Ratio", category: "Ratios", level: 0, segment: "Capital" },
    "20": { name: "NPL Ratio", category: "Risk", level: 0, segment: "Asset Quality" },
  }

  private parseCSVValue(value: string): number | null {
    if (!value || value.toLowerCase() === "na" || value.trim() === "") {
      return null
    }
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }

  private parseCSV(csvText: string): CSVDataRow[] {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: any = {}

      headers.forEach((header, index) => {
        const key = header === "" ? "id" : header.replace(/-/g, "_minus_")
        row[key] = values[index] || ""
      })

      return row as CSVDataRow
    })
  }

  private processRawData(rawData: CSVDataRow[]): ProcessedLineItem[] {
    return rawData
      .map((row) => {
        const itemInfo = this.itemNameMapping[row.id] || {
          name: `Item ${row.id}`,
          category: "Other",
          level: 0,
          segment: "General",
        }

        // Parse numerical values
        const q1_current = this.parseCSVValue(row.q1_t)
        const q1_previous = this.parseCSVValue(row.q1_t_minus_1)
        const q2_previous = this.parseCSVValue(row.q2_t_minus_1)
        const q3_previous = this.parseCSVValue(row.q3_t_minus_1)
        const full_year_previous = this.parseCSVValue(row.f_t_minus_1)

        // Calculate variance (using Q1 current vs Q1 previous as primary comparison)
        const currentValue = q1_current
        const previousValue = q1_previous
        const variance = currentValue !== null && previousValue !== null ? currentValue - previousValue : null
        const variancePercent =
          variance !== null && previousValue !== null && previousValue !== 0
            ? (variance / Math.abs(previousValue)) * 100
            : null

        return {
          id: row.id,
          item: itemInfo.name,
          category: itemInfo.category,
          bank: "ADIB", // Since this is ADIB-specific data
          level: itemInfo.level,
          currentValue,
          previousValue,
          variance,
          variancePercent,
          q1_current,
          q1_previous,
          q2_previous,
          q3_previous,
          full_year_previous,
          segment: itemInfo.segment,
          subCategory: itemInfo.segment,
        }
      })
      .filter((item) => item.currentValue !== null || item.previousValue !== null) // Filter out items with no data
  }

  private generateFilterOptions(data: ProcessedLineItem[]): FilterOptions {
    const banks = [...new Set(data.map((item) => item.bank))].sort()
    const categories = [...new Set(data.map((item) => item.category))].sort()
    const periods = ["q1_2024", "q1_2023", "q2_2023", "q3_2023", "fy_2023"] // Based on available data columns
    const items = [...new Set(data.map((item) => item.item))].sort()

    return { banks, categories, periods, items }
  }

  async fetchAndProcessData(): Promise<{ data: ProcessedLineItem[]; filterOptions: FilterOptions }> {
    if (this.cachedData && this.filterOptions) {
      return { data: this.cachedData, filterOptions: this.filterOptions }
    }

    try {
      console.log("Fetching CSV data from:", this.csvUrl)
      const response = await fetch(this.csvUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const csvText = await response.text()
      console.log("CSV data fetched, length:", csvText.length)

      const rawData = this.parseCSV(csvText)
      console.log("Parsed CSV rows:", rawData.length)

      const processedData = this.processRawData(rawData)
      console.log("Processed line items:", processedData.length)

      const filterOptions = this.generateFilterOptions(processedData)

      // Cache the results
      this.cachedData = processedData
      this.filterOptions = filterOptions

      return { data: processedData, filterOptions }
    } catch (error) {
      console.error("Error fetching/processing CSV data:", error)
      throw error
    }
  }

  async getFilteredData(filters: {
    banks?: string[]
    categories?: string[]
    periods?: string[]
    items?: string[]
  }): Promise<ProcessedLineItem[]> {
    const { data } = await this.fetchAndProcessData()

    return data.filter((item) => {
      if (filters.banks && filters.banks.length > 0 && !filters.banks.includes(item.bank)) {
        return false
      }
      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false
      }
      if (filters.items && filters.items.length > 0 && !filters.items.includes(item.item)) {
        return false
      }
      return true
    })
  }

  async getFilterOptions(): Promise<FilterOptions> {
    const { filterOptions } = await this.fetchAndProcessData()
    return filterOptions
  }

  // Generate historical data for charts based on CSV data
  async getHistoricalData(
    bank: string,
    metrics: string[],
  ): Promise<Record<string, Array<{ quarter: string; value: number }>>> {
    const { data } = await this.fetchAndProcessData()
    const result: Record<string, Array<{ quarter: string; value: number }>> = {}

    // Map metric IDs to item names for lookup
    const metricToItemMap: Record<string, string> = {
      NIM: "Net Interest Margin (NIM)",
      ROA: "Return on Assets (ROA)",
      ROE: "Return on Equity (ROE)",
      ER: "Cost to Income Ratio",
      CAR: "Capital Adequacy Ratio",
      NPLR: "NPL Ratio",
    }

    metrics.forEach((metricId) => {
      const itemName = metricToItemMap[metricId]
      const item = data.find((d) => d.item === itemName && d.bank === bank)

      if (item) {
        const historicalData = []

        // Create historical data points from available periods
        if (item.q3_previous !== null) {
          historicalData.push({ quarter: "Q3 2023", value: item.q3_previous })
        }
        if (item.q2_previous !== null) {
          historicalData.push({ quarter: "Q2 2023", value: item.q2_previous })
        }
        if (item.q1_previous !== null) {
          historicalData.push({ quarter: "Q1 2023", value: item.q1_previous })
        }
        if (item.q1_current !== null) {
          historicalData.push({ quarter: "Q1 2024", value: item.q1_current })
        }

        result[metricId] = historicalData.sort((a, b) => {
          const quarterOrder = { "Q1 2023": 1, "Q2 2023": 2, "Q3 2023": 3, "Q1 2024": 4 }
          return (
            (quarterOrder[a.quarter as keyof typeof quarterOrder] || 0) -
            (quarterOrder[b.quarter as keyof typeof quarterOrder] || 0)
          )
        })
      } else {
        result[metricId] = []
      }
    })

    return result
  }

  // Generate bank metrics for peer comparison
  async getBankMetrics(banks: string[], metrics: string[]): Promise<Record<string, Record<string, number>>> {
    const { data } = await this.fetchAndProcessData()
    const result: Record<string, Record<string, number>> = {}

    const metricToItemMap: Record<string, string> = {
      NIM: "Net Interest Margin (NIM)",
      ROA: "Return on Assets (ROA)",
      ROE: "Return on Equity (ROE)",
      ER: "Cost to Income Ratio",
      CAR: "Capital Adequacy Ratio",
      NPLR: "NPL Ratio",
    }

    banks.forEach((bank) => {
      result[bank] = {}
      metrics.forEach((metricId) => {
        const itemName = metricToItemMap[metricId]
        const item = data.find((d) => d.item === itemName && d.bank === bank)
        result[bank][metricId] = item?.currentValue || item?.q1_current || 0
      })
    })

    return result
  }

  clearCache(): void {
    this.cachedData = null
    this.filterOptions = null
  }
}

export const csvDataService = new CSVDataService()
