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

// Item ID to readable name mapping - expanded to cover all CSV items
const ITEM_ID_MAPPING: Record<string, { name: string; category: string; segment: string; level: number }> = {
  "1": { name: "Net Interest Income", category: "P&L", segment: "Revenue", level: 0 },
  "1.1": { name: "Interest Income", category: "P&L", segment: "Revenue", level: 1 },
  "1.1.1": { name: "Interest Income - Loans", category: "P&L", segment: "Revenue", level: 2 },
  "1.1.2": { name: "Interest Income - Securities", category: "P&L", segment: "Revenue", level: 2 },
  "1.1.3": { name: "Interest Income - Other", category: "P&L", segment: "Revenue", level: 2 },
  "1.2": { name: "Interest Expense", category: "P&L", segment: "Revenue", level: 1 },
  "1.2.1": { name: "Interest Expense - Deposits", category: "P&L", segment: "Revenue", level: 2 },
  "1.2.2": { name: "Interest Expense - Borrowings", category: "P&L", segment: "Revenue", level: 2 },
  "2": { name: "Non-Interest Income", category: "P&L", segment: "Revenue", level: 0 },
  "2.1": { name: "Fee and Commission Income", category: "P&L", segment: "Revenue", level: 1 },
  "2.1.1": { name: "Trade Finance Fees", category: "P&L", segment: "Revenue", level: 2 },
  "2.1.2": { name: "Credit Card Fees", category: "P&L", segment: "Revenue", level: 2 },
  "2.1.3": { name: "Banking Service Fees", category: "P&L", segment: "Revenue", level: 2 },
  "2.2": { name: "Trading Income", category: "P&L", segment: "Revenue", level: 1 },
  "2.2.1": { name: "FX Trading Income", category: "P&L", segment: "Revenue", level: 2 },
  "2.2.2": { name: "Securities Trading Income", category: "P&L", segment: "Revenue", level: 2 },
  "2.3": { name: "Other Operating Income", category: "P&L", segment: "Revenue", level: 1 },
  "3": { name: "Total Operating Income", category: "P&L", segment: "Revenue", level: 0 },
  "4": { name: "Operating Expenses", category: "P&L", segment: "Expenses", level: 0 },
  "4.1": { name: "Staff Costs", category: "P&L", segment: "Expenses", level: 1 },
  "4.1.1": { name: "Salaries and Benefits", category: "P&L", segment: "Expenses", level: 2 },
  "4.1.2": { name: "Training and Development", category: "P&L", segment: "Expenses", level: 2 },
  "4.2": { name: "Other Operating Expenses", category: "P&L", segment: "Expenses", level: 1 },
  "4.2.1": { name: "Technology Expenses", category: "P&L", segment: "Expenses", level: 2 },
  "4.2.2": { name: "Marketing Expenses", category: "P&L", segment: "Expenses", level: 2 },
  "4.2.3": { name: "Professional Services", category: "P&L", segment: "Expenses", level: 2 },
  "4.2.4": { name: "Premises and Equipment", category: "P&L", segment: "Expenses", level: 2 },
  "4.3": { name: "Depreciation and Amortization", category: "P&L", segment: "Expenses", level: 1 },
  "5": { name: "Impairment Charges", category: "P&L", segment: "Risk", level: 0 },
  "5.1": { name: "Loan Loss Provisions", category: "P&L", segment: "Risk", level: 1 },
  "5.1.1": { name: "Stage 1 Provisions", category: "P&L", segment: "Risk", level: 2 },
  "5.1.2": { name: "Stage 2 Provisions", category: "P&L", segment: "Risk", level: 2 },
  "5.1.3": { name: "Stage 3 Provisions", category: "P&L", segment: "Risk", level: 2 },
  "5.2": { name: "Other Impairments", category: "P&L", segment: "Risk", level: 1 },
  "6": { name: "Profit Before Tax", category: "P&L", segment: "Profitability", level: 0 },
  "7": { name: "Tax Expense", category: "P&L", segment: "Profitability", level: 1 },
  "8": { name: "Net Profit", category: "P&L", segment: "Profitability", level: 0 },
  "9": { name: "Total Assets", category: "Balance Sheet", segment: "Assets", level: 0 },
  "9.1": { name: "Cash and Bank Balances", category: "Balance Sheet", segment: "Assets", level: 1 },
  "9.2": { name: "Due from Banks", category: "Balance Sheet", segment: "Assets", level: 1 },
  "9.3": { name: "Loans and Advances", category: "Balance Sheet", segment: "Assets", level: 1 },
  "9.3.1": { name: "Corporate Loans", category: "Balance Sheet", segment: "Assets", level: 2 },
  "9.3.2": { name: "Retail Loans", category: "Balance Sheet", segment: "Assets", level: 2 },
  "9.3.3": { name: "SME Loans", category: "Balance Sheet", segment: "Assets", level: 2 },
  "9.4": { name: "Investment Securities", category: "Balance Sheet", segment: "Assets", level: 1 },
  "9.4.1": { name: "Government Securities", category: "Balance Sheet", segment: "Assets", level: 2 },
  "9.4.2": { name: "Corporate Securities", category: "Balance Sheet", segment: "Assets", level: 2 },
  "9.5": { name: "Fixed Assets", category: "Balance Sheet", segment: "Assets", level: 1 },
  "9.6": { name: "Other Assets", category: "Balance Sheet", segment: "Assets", level: 1 },
  "10": { name: "Total Liabilities", category: "Balance Sheet", segment: "Liabilities", level: 0 },
  "10.1": { name: "Customer Deposits", category: "Balance Sheet", segment: "Liabilities", level: 1 },
  "10.1.1": { name: "Current Accounts", category: "Balance Sheet", segment: "Liabilities", level: 2 },
  "10.1.2": { name: "Savings Accounts", category: "Balance Sheet", segment: "Liabilities", level: 2 },
  "10.1.3": { name: "Time Deposits", category: "Balance Sheet", segment: "Liabilities", level: 2 },
  "10.2": { name: "Due to Banks", category: "Balance Sheet", segment: "Liabilities", level: 1 },
  "10.3": { name: "Borrowings", category: "Balance Sheet", segment: "Liabilities", level: 1 },
  "10.4": { name: "Other Liabilities", category: "Balance Sheet", segment: "Liabilities", level: 1 },
  "11": { name: "Total Equity", category: "Balance Sheet", segment: "Equity", level: 0 },
  "11.1": { name: "Share Capital", category: "Balance Sheet", segment: "Equity", level: 1 },
  "11.2": { name: "Retained Earnings", category: "Balance Sheet", segment: "Equity", level: 1 },
  "11.3": { name: "Other Reserves", category: "Balance Sheet", segment: "Equity", level: 1 },
  // KPI Metrics
  "12": { name: "Net Interest Margin", category: "KPI", segment: "Profitability", level: 0 },
  "13": { name: "Return on Assets", category: "KPI", segment: "Profitability", level: 0 },
  "14": { name: "Return on Equity", category: "KPI", segment: "Profitability", level: 0 },
  "15": { name: "Cost to Income Ratio", category: "KPI", segment: "Efficiency", level: 0 },
  "16": { name: "Loan to Deposit Ratio", category: "KPI", segment: "Liquidity", level: 0 },
  "17": { name: "Capital Adequacy Ratio", category: "Ratios", segment: "Capital", level: 0 },
  "18": { name: "Tier 1 Capital Ratio", category: "Ratios", segment: "Capital", level: 0 },
  "19": { name: "NPL Ratio", category: "Risk", segment: "Asset Quality", level: 0 },
  "20": { name: "Provision Coverage Ratio", category: "Risk", segment: "Asset Quality", level: 0 },
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
        .filter((row) => row.id && row.id.trim() !== "") // Include all rows with valid IDs

      this.csvData = dataRows
      console.log(`Loaded ${this.csvData.length} rows from CSV`)
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
      // Try to find exact match first, then fallback to generic mapping
      let itemInfo = ITEM_ID_MAPPING[row.id]

      if (!itemInfo) {
        // Create generic mapping for unknown items
        itemInfo = {
          name: `Item ${row.id}`,
          category: "Other",
          segment: "Unknown",
          level: 0,
        }
      }

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

    console.log(`Processed ${this.processedData.length} line items`)
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
