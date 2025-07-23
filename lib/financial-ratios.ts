export interface FinancialRatio {
  name: string
  value: number
  previousValue: number
  category: "Profitability" | "Efficiency" | "Capital" | "Asset Quality"
  format: "percentage" | "ratio" | "bps"
  description: string
}

export const financialRatios: FinancialRatio[] = [
  {
    name: "Net Interest Margin",
    value: 3.45,
    previousValue: 3.38,
    category: "Profitability",
    format: "percentage",
    description: "Net interest income as a percentage of average earning assets",
  },
  {
    name: "Return on Equity",
    value: 12.8,
    previousValue: 12.1,
    category: "Profitability",
    format: "percentage",
    description: "Net income as a percentage of average shareholders' equity",
  },
  {
    name: "Return on Assets",
    value: 1.15,
    previousValue: 1.08,
    category: "Profitability",
    format: "percentage",
    description: "Net income as a percentage of average total assets",
  },
  {
    name: "Capital Adequacy Ratio",
    value: 12.5,
    previousValue: 12.2,
    category: "Capital",
    format: "percentage",
    description: "Tier 1 capital as a percentage of risk-weighted assets",
  },
  {
    name: "Common Equity Tier 1",
    value: 11.2,
    previousValue: 10.9,
    category: "Capital",
    format: "percentage",
    description: "Common equity tier 1 capital ratio",
  },
  {
    name: "Non-Performing Loans",
    value: 0.45,
    previousValue: 0.48,
    category: "Asset Quality",
    format: "percentage",
    description: "Non-performing loans as a percentage of total loans",
  },
  {
    name: "Efficiency Ratio",
    value: 58.2,
    previousValue: 59.8,
    category: "Efficiency",
    format: "percentage",
    description: "Non-interest expenses as a percentage of total revenue",
  },
  {
    name: "Loan-to-Deposit Ratio",
    value: 89.5,
    previousValue: 89.2,
    category: "Efficiency",
    format: "percentage",
    description: "Total loans as a percentage of total deposits",
  },
]

export function formatRatioValue(value: number, format: "percentage" | "ratio" | "bps"): string {
  switch (format) {
    case "percentage":
      return `${value.toFixed(2)}%`
    case "ratio":
      return `${value.toFixed(2)}x`
    case "bps":
      return `${value} bps`
    default:
      return value.toString()
  }
}

export function calculateChange(
  current: number,
  previous: number,
): {
  absolute: number
  percentage: number
  isPositive: boolean
} {
  const absolute = current - previous
  const percentage = (absolute / previous) * 100
  return {
    absolute,
    percentage,
    isPositive: absolute >= 0,
  }
}
