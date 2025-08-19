export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface PeriodFilter {
  id: string
  label: string
  periods: string[]
}

// Period filter options based on master CSV analysis
export const periodFilters: PeriodFilter[] = [
  {
    id: "quarterly",
    label: "Quarterly",
    periods: ["jfm_2024", "amj_2024", "jas_2024", "ond_2024", "jfm_2023", "amj_2023", "jas_2023", "ond_2023"],
  },
  {
    id: "half_yearly",
    label: "Half Yearly",
    periods: ["h1_2024", "h2_2024", "h1_2023", "h2_2023"],
  },
  {
    id: "nine_months",
    label: "9 Months",
    periods: ["9m_2024", "9m_2023"],
  },
  {
    id: "full_year",
    label: "Full Year",
    periods: ["fy_2024", "fy_2023"],
  },
]

// Column filter options
export const columnFilters: FilterOption[] = [
  { value: "current_period", label: "Current Period", count: 245 },
  { value: "previous_period", label: "Previous Period", count: 238 },
  { value: "variance_absolute", label: "Variance (Absolute)", count: 189 },
  { value: "variance_percent", label: "Variance (%)", count: 189 },
  { value: "yoy_change", label: "YoY Change", count: 156 },
  { value: "qoq_change", label: "QoQ Change", count: 142 },
]

// Category filters based on master CSV
export const categoryFilters: FilterOption[] = [
  { value: "P&L", label: "P&L Items", count: 89 },
  { value: "KPI", label: "Key Performance Indicators", count: 67 },
  { value: "Balance Sheet", label: "Balance Sheet", count: 45 },
  { value: "Ratios", label: "Financial Ratios", count: 34 },
  { value: "Risk", label: "Risk Metrics", count: 23 },
]

// Bank filters
export const bankFilters: FilterOption[] = [
  { value: "ADIB", label: "Abu Dhabi Islamic Bank", count: 156 },
  { value: "ENBD", label: "Emirates NBD", count: 142 },
  { value: "FAB", label: "First Abu Dhabi Bank", count: 138 },
  { value: "RAKBANK", label: "RAK Bank", count: 89 },
  { value: "CBD", label: "Commercial Bank of Dubai", count: 67 },
]

// Metric selection options with multi-select support
export const metricOptions: FilterOption[] = [
  { value: "net_interest_income", label: "Net Interest Income" },
  { value: "non_interest_income", label: "Non-Interest Income" },
  { value: "operating_income", label: "Operating Income" },
  { value: "operating_expenses", label: "Operating Expenses" },
  { value: "staff_costs", label: "Staff Costs" },
  { value: "other_expenses", label: "Other Operating Expenses" },
  { value: "impairment_charges", label: "Impairment Charges" },
  { value: "profit_before_tax", label: "Profit Before Tax" },
  { value: "net_profit", label: "Net Profit" },
  { value: "nim", label: "Net Interest Margin" },
  { value: "roe", label: "Return on Equity" },
  { value: "roa", label: "Return on Assets" },
  { value: "cost_to_income", label: "Cost to Income Ratio" },
  { value: "capital_adequacy", label: "Capital Adequacy Ratio" },
  { value: "tier1_ratio", label: "Tier 1 Capital Ratio" },
  { value: "loan_growth", label: "Loan Growth" },
  { value: "deposit_growth", label: "Deposit Growth" },
  { value: "npl_ratio", label: "NPL Ratio" },
  { value: "provision_coverage", label: "Provision Coverage Ratio" },
  { value: "eps", label: "Earnings Per Share" },
]
