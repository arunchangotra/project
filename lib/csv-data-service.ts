export interface CSVDataRow {
  bank: string
  id: string
  Item: string
  category: string
  sub_category1: string
  "sub category2": string
  sub_category3: string
  sub_category4: string
  level: number
  Alias: string
  jfm_2025: string | null
  amj_2025: string | null
  jas_2025: string | null
  ond_2025: string | null
  h1_2025: string | null
  "9m_2025": string | null
  h2_2025: string | null
  fy_2025: string | null
  jfm_2024: string | null
  amj_2024: string | null
  jas_2024: string | null
  ond_2024: string | null
  h1_2024: string | null
  "9m_2024": string | null
  h2_2024: string | null
  fy_2024: string | null
  jfm_2023: string | null
  amj_2023: string | null
  jas_2023: string | null
  ond_2023: string | null
  h1_2023: string | null
  "9m_2023": string | null
  h2_2023: string | null
  fy_2023: string | null
}

export interface ProcessedLineItem {
  id: string
  bank: string
  item: string
  category: string
  subCategory1: string
  subCategory2: string
  level: number
  alias?: string
  periods: Record<string, number | null>
  currentValue: number | null
  previousValue: number | null
  variance: number | null
  variancePercent: number | null
}

export interface FilterOptions {
  banks: string[]
  categories: string[]
  periods: string[]
  items: string[]
}

class CSVDataService {
  private csvData: CSVDataRow[] = []
  private isLoaded = false
  private readonly CSV_URL =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/master_csv-0LKeIw1M62B0RYkhJZJDhvL9ohQ8re.csv"

  async loadData(): Promise<void> {
    if (this.isLoaded) return

    try {
      const response = await fetch(this.CSV_URL)
      const csvText = await response.text()
      this.csvData = this.parseCSV(csvText)
      this.isLoaded = true
      console.log(`Loaded ${this.csvData.length} rows from CSV`)
    } catch (error) {
      console.error("Error loading CSV data:", error)
      throw error
    }
  }

  private parseCSV(csvText: string): CSVDataRow[] {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const data: CSVDataRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = this.parseCSVLine(line)
      if (values.length !== headers.length) continue

      const row: any = {}
      headers.forEach((header, index) => {
        let value = values[index]?.trim().replace(/"/g, "")

        // Handle special cases
        if (value === "na" || value === "" || value === "null") {
          value = null
        } else if (header === "level" && value) {
          value = Number.parseInt(value) || 0
        } else if (this.isPeriodColumn(header) && value && value !== "na") {
          // Try to parse as number for period columns
          const numValue = Number.parseFloat(value)
          value = isNaN(numValue) ? null : numValue
        }

        row[header] = value
      })

      data.push(row as CSVDataRow)
    }

    return data
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  private isPeriodColumn(header: string): boolean {
    const periodColumns = [
      "jfm_2025",
      "amj_2025",
      "jas_2025",
      "ond_2025",
      "h1_2025",
      "9m_2025",
      "h2_2025",
      "fy_2025",
      "jfm_2024",
      "amj_2024",
      "jas_2024",
      "ond_2024",
      "h1_2024",
      "9m_2024",
      "h2_2024",
      "fy_2024",
      "jfm_2023",
      "amj_2023",
      "jas_2023",
      "ond_2023",
      "h1_2023",
      "9m_2023",
      "h2_2023",
      "fy_2023",
    ]
    return periodColumns.includes(header)
  }

  getAvailableBanks(): string[] {
    const banks = new Set(this.csvData.map((row) => row.bank).filter(Boolean))
    return Array.from(banks).sort()
  }

  getAvailableCategories(): string[] {
    const categories = new Set(this.csvData.map((row) => row.category).filter(Boolean))
    return Array.from(categories).sort()
  }

  getAvailablePeriods(): string[] {
    const periodColumns = [
      "jfm_2025",
      "amj_2025",
      "jas_2025",
      "ond_2025",
      "h1_2025",
      "9m_2025",
      "fy_2025",
      "jfm_2024",
      "amj_2024",
      "jas_2024",
      "ond_2024",
      "h1_2024",
      "9m_2024",
      "fy_2024",
      "jfm_2023",
      "amj_2023",
      "jas_2023",
      "ond_2023",
      "h1_2023",
      "9m_2023",
      "fy_2023",
    ]

    // Filter periods that have actual data
    return periodColumns.filter((period) => {
      return this.csvData.some((row) => {
        const value = (row as any)[period]
        return value !== null && value !== "na" && value !== ""
      })
    })
  }

  getAvailableItems(filters?: Partial<FilterOptions>): string[] {
    let filteredData = this.csvData

    if (filters?.banks?.length) {
      filteredData = filteredData.filter((row) => filters.banks!.includes(row.bank))
    }

    if (filters?.categories?.length) {
      filteredData = filteredData.filter((row) => filters.categories!.includes(row.category))
    }

    const items = new Set(filteredData.map((row) => row.Item).filter(Boolean))
    return Array.from(items).sort()
  }

  getFilteredData(filters: Partial<FilterOptions>): ProcessedLineItem[] {
    let filteredData = this.csvData

    // Apply filters
    if (filters.banks?.length) {
      filteredData = filteredData.filter((row) => filters.banks!.includes(row.bank))
    }

    if (filters.categories?.length) {
      filteredData = filteredData.filter((row) => filters.categories!.includes(row.category))
    }

    if (filters.items?.length) {
      filteredData = filteredData.filter((row) => filters.items!.includes(row.Item))
    }

    // Process data into the required format
    return filteredData.map((row) => this.processRowToLineItem(row, filters.periods))
  }

  private processRowToLineItem(row: CSVDataRow, selectedPeriods?: string[]): ProcessedLineItem {
    const periods: Record<string, number | null> = {}

    // Extract all period values
    const periodColumns = [
      "jfm_2025",
      "amj_2025",
      "jas_2025",
      "ond_2025",
      "h1_2025",
      "9m_2025",
      "fy_2025",
      "jfm_2024",
      "amj_2024",
      "jas_2024",
      "ond_2024",
      "h1_2024",
      "9m_2024",
      "fy_2024",
      "jfm_2023",
      "amj_2023",
      "jas_2023",
      "ond_2023",
      "h1_2023",
      "9m_2023",
      "fy_2023",
    ]

    periodColumns.forEach((period) => {
      const value = (row as any)[period]
      if (value !== null && value !== "na" && value !== "") {
        const numValue = typeof value === "number" ? value : Number.parseFloat(value)
        periods[period] = isNaN(numValue) ? null : numValue
      } else {
        periods[period] = null
      }
    })

    // Determine current and previous values based on selected periods or default logic
    let currentValue: number | null = null
    let previousValue: number | null = null

    if (selectedPeriods?.length === 2) {
      currentValue = periods[selectedPeriods[0]] || null
      previousValue = periods[selectedPeriods[1]] || null
    } else {
      // Default to latest available periods
      const availablePeriods = Object.entries(periods)
        .filter(([_, value]) => value !== null)
        .sort(([a], [b]) => b.localeCompare(a)) // Sort descending by period name

      if (availablePeriods.length >= 2) {
        currentValue = availablePeriods[0][1]
        previousValue = availablePeriods[1][1]
      } else if (availablePeriods.length === 1) {
        currentValue = availablePeriods[0][1]
      }
    }

    // Calculate variance
    let variance: number | null = null
    let variancePercent: number | null = null

    if (currentValue !== null && previousValue !== null) {
      variance = currentValue - previousValue
      if (previousValue !== 0) {
        variancePercent = (variance / Math.abs(previousValue)) * 100
      }
    }

    return {
      id: row.id || `${row.bank}_${row.Item}`,
      bank: row.bank,
      item: row.Item,
      category: row.category,
      subCategory1: row.sub_category1 || "",
      subCategory2: row["sub category2"] || "",
      level: row.level || 0,
      alias: row.Alias || undefined,
      periods,
      currentValue,
      previousValue,
      variance,
      variancePercent,
    }
  }

  getBankMetrics(bank: string, metricIds: string[]): Record<string, number> {
    const bankData = this.csvData.filter((row) => row.bank === bank)
    const metrics: Record<string, number> = {}

    metricIds.forEach((metricId) => {
      // Map metric IDs to CSV items - this mapping should be customized based on your data
      const metricMapping: Record<string, string> = {
        NIM: "Net Interest Margin",
        ROE: "Return on Equity",
        ROA: "Return on Assets",
        CAR: "Capital Adequacy Ratio",
        CET1: "Common Equity Tier 1 Ratio",
        NPLR: "Non-Performing Loan Ratio",
        LDR: "Loan-to-Deposit Ratio",
        CASA: "CASA Ratio",
        PER: "P/E Ratio",
        ER: "Efficiency Ratio",
      }

      const itemName = metricMapping[metricId]
      if (itemName) {
        const item = bankData.find((row) => row.Item === itemName)
        if (item) {
          // Get the latest available value
          const latestValue = this.getLatestValue(item)
          if (latestValue !== null) {
            metrics[metricId] = latestValue
          }
        }
      }
    })

    return metrics
  }

  private getLatestValue(row: CSVDataRow): number | null {
    const periodColumns = [
      "jas_2024",
      "amj_2024",
      "jfm_2024",
      "fy_2024",
      "9m_2024",
      "h1_2024",
      "jas_2023",
      "amj_2023",
      "jfm_2023",
      "fy_2023",
      "9m_2023",
      "h1_2023",
    ]

    for (const period of periodColumns) {
      const value = (row as any)[period]
      if (value !== null && value !== "na" && value !== "") {
        const numValue = typeof value === "number" ? value : Number.parseFloat(value)
        if (!isNaN(numValue)) {
          return numValue
        }
      }
    }

    return null
  }

  getHistoricalData(bank: string, metricId: string): Array<{ quarter: string; value: number }> {
    const metricMapping: Record<string, string> = {
      NIM: "Net Interest Margin",
      ROE: "Return on Equity",
      ROA: "Return on Assets",
      CAR: "Capital Adequacy Ratio",
      CET1: "Common Equity Tier 1 Ratio",
      NPLR: "Non-Performing Loan Ratio",
      LDR: "Loan-to-Deposit Ratio",
      CASA: "CASA Ratio",
      PER: "P/E Ratio",
      ER: "Efficiency Ratio",
    }

    const itemName = metricMapping[metricId]
    if (!itemName) return []

    const item = this.csvData.find((row) => row.bank === bank && row.Item === itemName)
    if (!item) return []

    const historicalData: Array<{ quarter: string; value: number }> = []

    // Map periods to readable quarter names
    const periodMapping: Record<string, string> = {
      jfm_2024: "Q1 2024",
      amj_2024: "Q2 2024",
      jas_2024: "Q3 2024",
      ond_2024: "Q4 2024",
      jfm_2023: "Q1 2023",
      amj_2023: "Q2 2023",
      jas_2023: "Q3 2023",
      ond_2023: "Q4 2023",
    }

    Object.entries(periodMapping).forEach(([period, quarter]) => {
      const value = (item as any)[period]
      if (value !== null && value !== "na" && value !== "") {
        const numValue = typeof value === "number" ? value : Number.parseFloat(value)
        if (!isNaN(numValue)) {
          historicalData.push({ quarter, value: numValue })
        }
      }
    })

    return historicalData.sort((a, b) => a.quarter.localeCompare(b.quarter))
  }

  isDataLoaded(): boolean {
    return this.isLoaded
  }

  getDataSummary() {
    return {
      totalRows: this.csvData.length,
      banks: this.getAvailableBanks().length,
      categories: this.getAvailableCategories().length,
      periods: this.getAvailablePeriods().length,
      items: this.getAvailableItems().length,
    }
  }
}

// Export singleton instance
export const csvDataService = new CSVDataService()
