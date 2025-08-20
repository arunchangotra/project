interface CSVRow {
  "": string // Item ID
  q1_t: string // Current quarter
  "q1_t-1": string // Previous quarter 1
  "q2_t-1": string // Previous quarter 2
  "q3_t-1": string // Previous quarter 3
  "f_t-1": string // Full year previous
  "q1_t-2": string // Two years ago Q1
  "q2_t-2": string // Two years ago Q2
  "q3_t-2": string // Two years ago Q3
  "f_t-2": string // Two years ago full year
}

interface ProcessedLineItem {
  id: string
  itemId: string
  item: string
  bank: string
  category: string
  segment: string
  currentValue: number | null
  previousValue: number | null
  variance: number | null
  variancePercent: number | null
  q1Current: number | null
  q1Previous: number | null
  q2Previous: number | null
  q3Previous: number | null
  fullYearPrevious: number | null
  q1TwoYearsAgo: number | null
  q2TwoYearsAgo: number | null
  q3TwoYearsAgo: number | null
  fullYearTwoYearsAgo: number | null
}

// Mapping of item IDs to financial statement items
const ITEM_ID_MAPPING: Record<string, { name: string; category: string; segment: string }> = {
  "1": { name: "Net Interest Income", category: "P&L", segment: "Revenue" },
  "2": { name: "Fee and Commission Income", category: "P&L", segment: "Revenue" },
  "3": { name: "Trading Income", category: "P&L", segment: "Revenue" },
  "4": { name: "Other Operating Income", category: "P&L", segment: "Revenue" },
  "5": { name: "Total Operating Income", category: "P&L", segment: "Revenue" },
  "6": { name: "Staff Costs", category: "P&L", segment: "Expenses" },
  "7": { name: "General and Administrative Expenses", category: "P&L", segment: "Expenses" },
  "8": { name: "Depreciation and Amortization", category: "P&L", segment: "Expenses" },
  "9": { name: "Total Operating Expenses", category: "P&L", segment: "Expenses" },
  "10": { name: "Operating Profit Before Provisions", category: "P&L", segment: "Profitability" },
  "11": { name: "Impairment Charges", category: "P&L", segment: "Risk" },
  "12": { name: "Net Operating Profit", category: "P&L", segment: "Profitability" },
  "13": { name: "Net Profit", category: "P&L", segment: "Profitability" },
  "14": { name: "Total Assets", category: "Balance Sheet", segment: "Assets" },
  "15": { name: "Loans and Advances", category: "Balance Sheet", segment: "Assets" },
  "16": { name: "Customer Deposits", category: "Balance Sheet", segment: "Liabilities" },
  "17": { name: "Total Equity", category: "Balance Sheet", segment: "Equity" },
  "18": { name: "Return on Assets (ROA)", category: "KPI", segment: "Efficiency" },
  "19": { name: "Return on Equity (ROE)", category: "KPI", segment: "Efficiency" },
  "20": { name: "Net Interest Margin (NIM)", category: "KPI", segment: "Efficiency" },
}

class CSVDataService {
  private static instance: CSVDataService
  private csvData: ProcessedLineItem[] | null = null
  private isLoading = false
  private error: string | null = null

  private constructor() {}

  static getInstance(): CSVDataService {
    if (!CSVDataService.instance) {
      CSVDataService.instance = new CSVDataService()
    }
    return CSVDataService.instance
  }

  private parseCSVValue(value: string): number | null {
    if (!value || value.trim() === "" || value.toLowerCase() === "na") {
      return null
    }
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }

  private processCSVRow(row: CSVRow): ProcessedLineItem | null {
    const itemId = row[""].trim()
    if (!itemId || !ITEM_ID_MAPPING[itemId]) {
      return null
    }

    const mapping = ITEM_ID_MAPPING[itemId]
    const q1Current = this.parseCSVValue(row["q1_t"])
    const q1Previous = this.parseCSVValue(row["q1_t-1"])

    // Calculate variance
    const variance = q1Current !== null && q1Previous !== null ? q1Current - q1Previous : null
    const variancePercent =
      variance !== null && q1Previous !== null && q1Previous !== 0 ? (variance / q1Previous) * 100 : null

    return {
      id: `item-${itemId}`,
      itemId,
      item: mapping.name,
      bank: "ADIB", // From the CSV file provided
      category: mapping.category,
      segment: mapping.segment,
      currentValue: q1Current,
      previousValue: q1Previous,
      variance,
      variancePercent,
      q1Current,
      q1Previous,
      q2Previous: this.parseCSVValue(row["q2_t-1"]),
      q3Previous: this.parseCSVValue(row["q3_t-1"]),
      fullYearPrevious: this.parseCSVValue(row["f_t-1"]),
      q1TwoYearsAgo: this.parseCSVValue(row["q1_t-2"]),
      q2TwoYearsAgo: this.parseCSVValue(row["q2_t-2"]),
      q3TwoYearsAgo: this.parseCSVValue(row["q3_t-2"]),
      fullYearTwoYearsAgo: this.parseCSVValue(row["f_t-2"]),
    }
  }

  async fetchCSVData(): Promise<ProcessedLineItem[]> {
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
    this.error = null

    try {
      console.log(
        "Fetching CSV data from:",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adib_csv-NnJWhpVRJafi03oUOvKnAwYIuMmOzx.csv",
      )

      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adib_csv-NnJWhpVRJafi03oUOvKnAwYIuMmOzx.csv",
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const csvText = await response.text()
      console.log("CSV data fetched, length:", csvText.length)

      // Parse CSV manually (simple approach for this specific format)
      const lines = csvText.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

      console.log("CSV headers:", headers)

      const processedData: ProcessedLineItem[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())

        if (values.length >= headers.length) {
          const row: CSVRow = {
            "": values[0] || "",
            q1_t: values[1] || "",
            "q1_t-1": values[2] || "",
            "q2_t-1": values[3] || "",
            "q3_t-1": values[4] || "",
            "f_t-1": values[5] || "",
            "q1_t-2": values[6] || "",
            "q2_t-2": values[7] || "",
            "q3_t-2": values[8] || "",
            "f_t-2": values[9] || "",
          }

          const processedItem = this.processCSVRow(row)
          if (processedItem) {
            processedData.push(processedItem)
          }
        }
      }

      console.log("Processed CSV data:", processedData.length, "items")
      console.log("Sample processed item:", processedData[0])

      this.csvData = processedData
      return processedData
    } catch (error) {
      console.error("Error fetching CSV data:", error)
      this.error = error instanceof Error ? error.message : "Unknown error"
      return []
    } finally {
      this.isLoading = false
    }
  }

  getFilterOptions(): {
    banks: string[]
    categories: string[]
    periods: string[]
    segments: string[]
  } {
    if (!this.csvData) {
      return { banks: [], categories: [], periods: [], segments: [] }
    }

    const banks = Array.from(new Set(this.csvData.map((item) => item.bank)))
    const categories = Array.from(new Set(this.csvData.map((item) => item.category)))
    const segments = Array.from(new Set(this.csvData.map((item) => item.segment)))
    const periods = ["q1_t", "q1_t-1", "q2_t-1", "q3_t-1", "f_t-1"] // Available periods from CSV

    return { banks, categories, periods, segments }
  }

  filterData(filters: {
    banks?: string[]
    categories?: string[]
    periods?: string[]
    segments?: string[]
  }): ProcessedLineItem[] {
    if (!this.csvData) {
      return []
    }

    let filtered = this.csvData

    if (filters.banks && filters.banks.length > 0) {
      filtered = filtered.filter((item) => filters.banks!.includes(item.bank))
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((item) => filters.categories!.includes(item.category))
    }

    if (filters.segments && filters.segments.length > 0) {
      filtered = filtered.filter((item) => filters.segments!.includes(item.segment))
    }

    return filtered
  }

  getHistoricalData(bank: string, itemIds: string[]): Record<string, Array<{ quarter: string; value: number }>> {
    if (!this.csvData) {
      return {}
    }

    const result: Record<string, Array<{ quarter: string; value: number }>> = {}

    const bankData = this.csvData.filter((item) => item.bank === bank)

    itemIds.forEach((itemId) => {
      const item = bankData.find((d) => d.itemId === itemId)
      if (item) {
        result[itemId] = []

        // Add historical quarters with actual data
        if (item.q1Current !== null) {
          result[itemId].push({ quarter: "Q1 2024", value: item.q1Current })
        }
        if (item.q1Previous !== null) {
          result[itemId].push({ quarter: "Q1 2023", value: item.q1Previous })
        }
        if (item.q2Previous !== null) {
          result[itemId].push({ quarter: "Q2 2023", value: item.q2Previous })
        }
        if (item.q3Previous !== null) {
          result[itemId].push({ quarter: "Q3 2023", value: item.q3Previous })
        }
      }
    })

    return result
  }

  clearCache(): void {
    this.csvData = null
    this.error = null
  }

  getError(): string | null {
    return this.error
  }

  isDataLoading(): boolean {
    return this.isLoading
  }
}

export const csvDataService = CSVDataService.getInstance()
export type { ProcessedLineItem }
