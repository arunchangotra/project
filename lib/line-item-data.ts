export interface LineItemData {
  id: string
  bank: string
  item: string
  category: string
  subCategory1?: string
  subCategory2?: string
  level: number
  alias?: string
  periods: Record<string, number | string | null>
  segment?: string
  variance?: number
  variancePercent?: number
}

export interface LineItemFilter {
  banks: string[]
  categories: string[]
  periods: string[]
  columns: string[]
}

// Bank filter options based on master CSV
export const bankFilterOptions = [
  { value: "ADIB", label: "ADIB", color: "bg-blue-600" },
  { value: "FAB", label: "FAB", color: "bg-green-600" },
  { value: "ENBD", label: "ENBD", color: "bg-purple-600" },
  { value: "CBD", label: "CBD", color: "bg-orange-600" },
  { value: "RAKBANK", label: "RAKBANK", color: "bg-red-600" },
  { value: "MASHREQ", label: "MASHREQ", color: "bg-indigo-600" },
]

// Category filter options
export const categoryFilterOptions = [
  { value: "P&L", label: "P&L", count: 89 },
  { value: "KPI", label: "KPI", count: 67 },
  { value: "Balance Sheet", label: "Balance Sheet", count: 45 },
  { value: "Ratios", label: "Ratios", count: 34 },
  { value: "Risk", label: "Risk", count: 23 },
]

// Column filter options for line item analysis
export const columnFilterOptions = [
  { value: "item", label: "Item Name", selected: true },
  { value: "current_period", label: "Current Period", selected: true },
  { value: "previous_period", label: "Previous Period", selected: true },
  { value: "variance", label: "Variance ($)", selected: true },
  { value: "variance_percent", label: "Variance (%)", selected: true },
  { value: "segment", label: "Segment", selected: true },
  { value: "yoy_change", label: "YoY Change", selected: false },
  { value: "qoq_change", label: "QoQ Change", selected: false },
  { value: "ai_explanation", label: "AI Explanation", selected: true },
]

// Period filter options
export const periodFilterOptions = [
  { value: "fy_2024", label: "FY 2024", type: "annual" },
  { value: "fy_2023", label: "FY 2023", type: "annual" },
  { value: "9m_2024", label: "9M 2024", type: "nine_months" },
  { value: "9m_2023", label: "9M 2023", type: "nine_months" },
  { value: "h1_2024", label: "H1 2024", type: "half_yearly" },
  { value: "h1_2023", label: "H1 2023", type: "half_yearly" },
  { value: "jas_2024", label: "Q3 2024", type: "quarterly" },
  { value: "amj_2024", label: "Q2 2024", type: "quarterly" },
  { value: "jfm_2024", label: "Q1 2024", type: "quarterly" },
]

// Sample line item data structure (this would be populated from the CSV)
export const sampleLineItemData: LineItemData[] = [
  {
    id: "operating_income_adib",
    bank: "ADIB",
    item: "Operating Income",
    category: "P&L",
    subCategory1: "total_bank",
    level: 1,
    periods: {
      fy_2024: 2847,
      fy_2023: 2766,
      jas_2024: 891,
      amj_2024: 845,
    },
    segment: "Consolidated",
    variance: 81,
    variancePercent: 2.9,
  },
  {
    id: "interest_income_adib",
    bank: "ADIB",
    item: "Interest Income",
    category: "P&L",
    subCategory1: "revenue",
    level: 2,
    periods: {
      fy_2024: 2426,
      fy_2023: 2301,
      jas_2024: 658,
      amj_2024: 625,
    },
    segment: "Revenue",
    variance: 33,
    variancePercent: 5.3,
  },
  {
    id: "operating_expenses_adib",
    bank: "ADIB",
    item: "Operating Expenses",
    category: "P&L",
    subCategory1: "total_bank",
    level: 1,
    periods: {
      fy_2024: 1671,
      fy_2023: 1657,
      jas_2024: 425,
      amj_2024: 418,
    },
    segment: "Consolidated",
    variance: 7,
    variancePercent: 1.7,
  },
]
