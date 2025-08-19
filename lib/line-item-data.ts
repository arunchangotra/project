export interface LineItemData {
  id: string
  bank: string
  item: string
  category: string
  subcategory?: string
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
  subcategories: string[]
  periods: string[]
  columns: string[]
}

// Comprehensive line item data structure based on actual banking P&L and Balance Sheet
export const lineItemData: LineItemData[] = [
  // ADIB Data - P&L Items
  {
    id: "adib_operating_income",
    bank: "ADIB",
    item: "Operating Income",
    category: "P&L",
    subcategory: "total_bank",
    level: 1,
    periods: {
      fy_2024: 2847,
      fy_2023: 2766,
      jas_2024: 891,
      amj_2024: 845,
      jfm_2024: 756,
    },
    segment: "Consolidated",
    variance: 81,
    variancePercent: 2.9,
  },
  {
    id: "adib_interest_income",
    bank: "ADIB",
    item: "Interest Income",
    category: "P&L",
    subcategory: "revenue",
    level: 2,
    periods: {
      fy_2024: 2426,
      fy_2023: 2301,
      jas_2024: 658,
      amj_2024: 625,
      jfm_2024: 543,
    },
    segment: "Revenue",
    variance: 33,
    variancePercent: 5.3,
  },
  {
    id: "adib_fee_income",
    bank: "ADIB",
    item: "Fee & Commission Income",
    category: "P&L",
    subcategory: "revenue",
    level: 2,
    periods: {
      fy_2024: 421,
      fy_2023: 465,
      jas_2024: 233,
      amj_2024: 220,
      jfm_2024: 213,
    },
    segment: "Revenue",
    variance: 13,
    variancePercent: 5.9,
  },
  {
    id: "adib_operating_expenses",
    bank: "ADIB",
    item: "Operating Expenses",
    category: "P&L",
    subcategory: "expenses",
    level: 1,
    periods: {
      fy_2024: 1671,
      fy_2023: 1657,
      jas_2024: 425,
      amj_2024: 418,
      jfm_2024: 398,
    },
    segment: "Consolidated",
    variance: 7,
    variancePercent: 1.7,
  },
  {
    id: "adib_staff_costs",
    bank: "ADIB",
    item: "Staff Costs",
    category: "P&L",
    subcategory: "expenses",
    level: 2,
    periods: {
      fy_2024: 892,
      fy_2023: 845,
      jas_2024: 228,
      amj_2024: 225,
      jfm_2024: 219,
    },
    segment: "Expenses",
    variance: 3,
    variancePercent: 1.3,
  },
  {
    id: "adib_impairment_charges",
    bank: "ADIB",
    item: "Impairment Charges",
    category: "P&L",
    subcategory: "provisions",
    level: 1,
    periods: {
      fy_2024: 245,
      fy_2023: 298,
      jas_2024: 62,
      amj_2024: 58,
      jfm_2024: 55,
    },
    segment: "Provisions",
    variance: 4,
    variancePercent: 6.9,
  },
  {
    id: "adib_net_profit",
    bank: "ADIB",
    item: "Net Profit",
    category: "P&L",
    subcategory: "total_bank",
    level: 0,
    periods: {
      fy_2024: 931,
      fy_2023: 811,
      jas_2024: 404,
      amj_2024: 369,
      jfm_2024: 303,
    },
    segment: "Consolidated",
    variance: 35,
    variancePercent: 9.5,
  },

  // FAB Data - P&L Items
  {
    id: "fab_operating_income",
    bank: "FAB",
    item: "Operating Income",
    category: "P&L",
    subcategory: "total_bank",
    level: 1,
    periods: {
      fy_2024: 3245,
      fy_2023: 3156,
      jas_2024: 1023,
      amj_2024: 978,
      jfm_2024: 889,
    },
    segment: "Consolidated",
    variance: 45,
    variancePercent: 4.6,
  },
  {
    id: "fab_interest_income",
    bank: "FAB",
    item: "Interest Income",
    category: "P&L",
    subcategory: "revenue",
    level: 2,
    periods: {
      fy_2024: 2789,
      fy_2023: 2634,
      jas_2024: 756,
      amj_2024: 723,
      jfm_2024: 656,
    },
    segment: "Revenue",
    variance: 33,
    variancePercent: 4.6,
  },
  {
    id: "fab_net_profit",
    bank: "FAB",
    item: "Net Profit",
    category: "P&L",
    subcategory: "total_bank",
    level: 0,
    periods: {
      fy_2024: 1245,
      fy_2023: 1156,
      jas_2024: 456,
      amj_2024: 423,
      jfm_2024: 366,
    },
    segment: "Consolidated",
    variance: 33,
    variancePercent: 7.8,
  },

  // ENBD Data - P&L Items
  {
    id: "enbd_operating_income",
    bank: "ENBD",
    item: "Operating Income",
    category: "P&L",
    subcategory: "total_bank",
    level: 1,
    periods: {
      fy_2024: 2156,
      fy_2023: 2089,
      jas_2024: 678,
      amj_2024: 645,
      jfm_2024: 589,
    },
    segment: "Consolidated",
    variance: 33,
    variancePercent: 5.1,
  },
  {
    id: "enbd_net_profit",
    bank: "ENBD",
    item: "Net Profit",
    category: "P&L",
    subcategory: "total_bank",
    level: 0,
    periods: {
      fy_2024: 823,
      fy_2023: 756,
      jas_2024: 298,
      amj_2024: 276,
      jfm_2024: 249,
    },
    segment: "Consolidated",
    variance: 22,
    variancePercent: 8.0,
  },

  // Balance Sheet Items - ADIB
  {
    id: "adib_total_assets",
    bank: "ADIB",
    item: "Total Assets",
    category: "Balance Sheet",
    subcategory: "assets",
    level: 0,
    periods: {
      fy_2024: 89456,
      fy_2023: 85234,
      jas_2024: 89456,
      amj_2024: 87234,
      jfm_2024: 86123,
    },
    segment: "Assets",
    variance: 2222,
    variancePercent: 2.5,
  },
  {
    id: "adib_financing_assets",
    bank: "ADIB",
    item: "Financing Assets",
    category: "Balance Sheet",
    subcategory: "assets",
    level: 1,
    periods: {
      fy_2024: 65234,
      fy_2023: 62156,
      jas_2024: 65234,
      amj_2024: 63456,
      jfm_2024: 62789,
    },
    segment: "Assets",
    variance: 1778,
    variancePercent: 2.8,
  },
  {
    id: "adib_customer_deposits",
    bank: "ADIB",
    item: "Customer Deposits",
    category: "Balance Sheet",
    subcategory: "liabilities",
    level: 1,
    periods: {
      fy_2024: 72345,
      fy_2023: 69123,
      jas_2024: 72345,
      amj_2024: 70456,
      jfm_2024: 69789,
    },
    segment: "Liabilities",
    variance: 1889,
    variancePercent: 2.7,
  },

  // KPI Items
  {
    id: "adib_nim",
    bank: "ADIB",
    item: "Net Interest Margin",
    category: "KPI",
    subcategory: "profitability",
    level: 0,
    periods: {
      fy_2024: 3.42,
      fy_2023: 3.28,
      jas_2024: 3.45,
      amj_2024: 3.38,
      jfm_2024: 3.35,
    },
    segment: "Profitability",
    variance: 0.07,
    variancePercent: 2.1,
  },
  {
    id: "adib_roe",
    bank: "ADIB",
    item: "Return on Equity",
    category: "KPI",
    subcategory: "profitability",
    level: 0,
    periods: {
      fy_2024: 11.2,
      fy_2023: 10.8,
      jas_2024: 11.5,
      amj_2024: 11.1,
      jfm_2024: 10.9,
    },
    segment: "Profitability",
    variance: 0.4,
    variancePercent: 3.6,
  },
  {
    id: "adib_cost_income",
    bank: "ADIB",
    item: "Cost to Income Ratio",
    category: "KPI",
    subcategory: "efficiency",
    level: 0,
    periods: {
      fy_2024: 58.7,
      fy_2023: 59.9,
      jas_2024: 58.2,
      amj_2024: 58.9,
      jfm_2024: 59.4,
    },
    segment: "Efficiency",
    variance: -0.7,
    variancePercent: -1.2,
  },

  // Risk Items
  {
    id: "adib_npl_ratio",
    bank: "ADIB",
    item: "NPL Ratio",
    category: "Risk",
    subcategory: "credit_risk",
    level: 0,
    periods: {
      fy_2024: 1.8,
      fy_2023: 2.1,
      jas_2024: 1.8,
      amj_2024: 1.9,
      jfm_2024: 2.0,
    },
    segment: "Credit Risk",
    variance: -0.1,
    variancePercent: -5.3,
  },
  {
    id: "adib_car",
    bank: "ADIB",
    item: "Capital Adequacy Ratio",
    category: "Ratios",
    subcategory: "capital",
    level: 0,
    periods: {
      fy_2024: 14.5,
      fy_2023: 14.2,
      jas_2024: 14.5,
      amj_2024: 14.3,
      jfm_2024: 14.1,
    },
    segment: "Capital",
    variance: 0.2,
    variancePercent: 1.4,
  },
]

// Sample line item data structure (this would be populated from the CSV)
export const sampleLineItemData: LineItemData[] = lineItemData
