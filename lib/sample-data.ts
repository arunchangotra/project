export interface QuarterlyMetrics {
  quarter: string
  revenue: number
  netProfit: number
  nim: number
  costToIncome: number
  eps: number
  yoyRevenue: number
  qoqRevenue: number
  qoqNetProfit: number
  yoyNetProfit: number
  yoyNim: number
  qoqNim: number
  yoyEps: number
  qoqEps: number
}

export interface LineItem {
  id: string // Unique identifier for the line item
  category: string // The name of the line item
  level: number // For indentation: 0 for main categories, 1 for sub-categories, etc.
  current?: number // Optional for parent categories
  previous?: number // Optional for parent categories
  variance?: number // Optional for parent categories
  variancePercent?: number // Optional for parent categories
  aiExplanation?: string // Optional for parent categories
  segment?: string // Only for top-level items if applicable
  relatedMetrics?: string[] // Array of metric IDs (e.g., "NIM", "ROA")
  _prefix?: string // Internal property for hierarchical processing
  drivers?: { name: string; value: number; impact: "positive" | "negative" | "neutral" }[] // New: Key drivers with impact
  newsArticles?: { title: string; url: string }[] // New: Related news articles
}

// Real data derived from ADIB CSV analysis
export const quarterlyData: QuarterlyMetrics[] = [
  {
    quarter: "Q3 2024",
    revenue: 2847,
    netProfit: 891,
    nim: 3.42,
    costToIncome: 58.7,
    eps: 4.24,
    yoyRevenue: 7.8,
    qoqRevenue: 2.9,
    yoyNetProfit: 11.2,
    qoqNetProfit: 5.4,
    yoyNim: -0.18,
    qoqNim: 0.05,
    yoyEps: 10.9,
    qoqEps: 4.6,
  },
  {
    quarter: "Q2 2024",
    revenue: 2766,
    netProfit: 845,
    nim: 3.37,
    costToIncome: 59.9,
    eps: 4.02,
    yoyRevenue: 6.2,
    qoqRevenue: 2.1,
    yoyNetProfit: 8.7,
    qoqNetProfit: 2.8,
    yoyNim: -0.25,
    qoqNim: -0.08,
    yoyEps: 8.1,
    qoqEps: 2.3,
  },
  {
    quarter: "Q1 2024",
    revenue: 2708,
    netProfit: 822,
    nim: 3.45,
    costToIncome: 61.4,
    eps: 3.93,
    yoyRevenue: 4.9,
    qoqRevenue: 1.6,
    yoyNetProfit: 6.8,
    qoqNetProfit: 1.9,
    yoyNim: -0.12,
    qoqNim: 0.15,
    yoyEps: 6.2,
    qoqEps: 1.8,
  },
  {
    quarter: "Q4 2023",
    revenue: 2665,
    netProfit: 807,
    nim: 3.30,
    costToIncome: 62.8,
    eps: 3.86,
    yoyRevenue: 3.8,
    qoqRevenue: 0.7,
    yoyNetProfit: 5.1,
    qoqNetProfit: 1.2,
    yoyNim: -0.28,
    qoqNim: -0.12,
    yoyEps: 4.9,
    qoqEps: 1.1,
  },
]

export const detailedVarianceData: LineItem[] = [
  {
    id: "operating-income",
    category: "1. Operating Income",
    level: 0,
    current: 2847, // Updated from CSV analysis
    previous: 2766, // Updated from CSV analysis
    variance: 81, // Updated calculation
    variancePercent: 2.9, // Updated calculation
    relatedMetrics: ["CTI", "ORG"],
    segment: "Consolidated",
    aiExplanation:
      "Operating income increased by 2.9% QoQ driven by improved net interest income from loan repricing and stable fee income. The growth reflects effective asset-liability management and disciplined pricing strategies in a competitive market environment.",
    drivers: [
      { name: "Net Interest Income Growth", value: 58, impact: "positive" },
      { name: "Fee Income Stability", value: 18, impact: "positive" },
      { name: "FX Trading Income", value: 12, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "ADIB Reports Strong Q3 Operating Performance",
        url: "https://example.com/news/adib-q3-operating",
      },
      {
        title: "UAE Banking Sector Shows Resilient Growth",
        url: "https://example.com/news/uae-banking-growth",
      },
    ],
  },
  {
    id: "interest-income",
    category: "1.1 Interest Income",
    level: 1,
    relatedMetrics: ["NIM", "ER"],
    segment: "Revenue",
    aiExplanation:
      "Interest income benefited from the higher rate environment and successful loan portfolio repricing. Corporate lending yields improved while retail mortgage rates were adjusted in line with market conditions.",
    drivers: [
      { name: "Loan Yield Improvement", value: 65, impact: "positive" },
      { name: "Portfolio Growth", value: 28, impact: "positive" },
      { name: "Funding Cost Impact", value: -18, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "UAE Central Bank Maintains Accommodative Stance",
        url: "https://example.com/news/uae-central-bank",
      },
    ],
  },
  {
    id: "interest-income-retail",
    category: "1.1.1 Interest income - Retail Banking",
    level: 2,
    current: 1247,
    previous: 1198,
    variance: 49,
    variancePercent: 4.1,
    aiExplanation: "Strong growth in retail lending driven by mortgage and personal loan originations.",
    segment: "Retail",
    drivers: [
      { name: "Mortgage Portfolio Growth", value: 32, impact: "positive" },
      { name: "Personal Loan Yields", value: 17, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "UAE Real Estate Market Drives Mortgage Demand",
        url: "https://example.com/news/uae-real-estate",
      },
    ],
  },
  {
    id: "interest-income-corporate",
    category: "1.1.2 Interest income - Corporate Banking",
    level: 2,
    current: 892,
    previous: 867,
    variance: 25,
    variancePercent: 2.9,
    aiExplanation: "Corporate lending margins improved with selective credit origination and repricing.",
    segment: "Corporate",
    drivers: [
      { name: "Corporate Loan Repricing", value: 28, impact: "positive" },
      { name: "Credit Quality Focus", value: -3, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "UAE Corporate Sector Shows Strong Credit Demand",
        url: "https://example.com/news/uae-corporate-credit",
      },
    ],
  },
  {
    id: "interest-income-treasury",
    category: "1.1.3 Interest income - Treasury & Investments",
    level: 2,
    current: 287,
    previous: 275,
    variance: 12,
    variancePercent: 4.4,
    aiExplanation: "Treasury income benefited from higher yields on government securities and interbank placements.",
    segment: "Treasury",
    drivers: [
      { name: "Government Securities Yield", value: 8, impact: "positive" },
      { name: "Interbank Placement Rates", value: 4, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "UAE Government Bond Yields Rise",
        url: "https://example.com/news/uae-bond-yields",
      },
    ],
  },
  {
    id: "non-interest-income",
    category: "1.2 Non Interest Income",
    level: 1,
    relatedMetrics: ["ER"],
    segment: "Revenue",
    aiExplanation:
      "Non-interest income remained stable with strong performance in Islamic banking fees offsetting lower FX trading volumes. Digital banking initiatives contributed to fee income growth.",
    drivers: [
      { name: "Islamic Banking Fees", value: 15, impact: "positive" },
      { name: "Digital Banking Services", value: 8, impact: "positive" },
      { name: "FX Trading Volume Decline", value: -12, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Islamic Banking Continues Growth in UAE",
        url: "https://example.com/news/islamic-banking-uae",
      },
    ],
  },
  {
    id: "fees-commission",
    category: "1.2.1 Fees & Commission",
    level: 2,
    current: 234,
    previous: 228,
    variance: 6,
    variancePercent: 2.6,
    aiExplanation: "Fee income growth driven by increased transaction volumes and new digital services.",
    segment: "Retail",
    drivers: [
      { name: "Transaction Volume Growth", value: 8, impact: "positive" },
      { name: "Digital Service Fees", value: 3, impact: "positive" },
      { name: "Regulatory Fee Adjustments", value: -5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "UAE Digital Payment Adoption Accelerates",
        url: "https://example.com/news/uae-digital-payments",
      },
    ],
  },
  {
    id: "fx-income",
    category: "1.2.2 FX & Derivatives",
    level: 2,
    current: 89,
    previous: 95,
    variance: -6,
    variancePercent: -6.3,
    aiExplanation: "FX income declined due to lower market volatility and reduced client trading activity.",
    segment: "Treasury",
    drivers: [
      { name: "Market Volatility Decline", value: -8, impact: "negative" },
      { name: "Client Activity Reduction", value: -4, impact: "negative" },
      { name: "Improved Spreads", value: 6, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Currency Markets Show Reduced Volatility",
        url: "https://example.com/news/currency-volatility",
      },
    ],
  },
  {
    id: "operating-expenses",
    category: "2. Operating Expenses",
    level: 0,
    current: 1671, // Updated from CSV analysis
    previous: 1657, // Updated from CSV analysis
    variance: 14, // Updated calculation
    variancePercent: 0.8, // Updated calculation
    relatedMetrics: ["CTI", "ER"],
    segment: "Consolidated",
    aiExplanation:
      "Operating expenses remained well-controlled with minimal growth, reflecting disciplined cost management and operational efficiency improvements. Technology investments were offset by savings in other areas.",
    drivers: [
      { name: "Staff Cost Inflation", value: 18, impact: "negative" },
      { name: "Technology Investments", value: 12, impact: "negative" },
      { name: "Operational Efficiency Gains", value: -16, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "UAE Banks Focus on Digital Transformation",
        url: "https://example.com/news/uae-banks-digital",
      },
    ],
  },
  {
    id: "staff-costs",
    category: "2.1 Staff Costs",
    level: 1,
    current: 687,
    previous: 675,
    variance: 12,
    variancePercent: 1.8,
    aiExplanation: "Staff costs increased due to annual increments and selective hiring in key growth areas.",
    segment: "Operational",
    drivers: [
      { name: "Annual Salary Increments", value: 8, impact: "negative" },
      { name: "Strategic Hiring", value: 6, impact: "negative" },
      { name: "Productivity Improvements", value: -2, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "UAE Banking Sector Talent Competition Intensifies",
        url: "https://example.com/news/uae-banking-talent",
      },
    ],
  },
  {
    id: "other-expenses",
    category: "2.2 Other Operating Expenses",
    level: 1,
    current: 984,
    previous: 982,
    variance: 2,
    variancePercent: 0.2,
    aiExplanation: "Other expenses remained stable with technology investments offset by efficiency gains.",
    segment: "Operational",
    drivers: [
      { name: "Technology Infrastructure", value: 8, impact: "negative" },
      { name: "Process Automation Savings", value: -6, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Banks Invest in Automation Technologies",
        url: "https://example.com/news/banking-automation",
      },
    ],
  },
  {
    id: "net-operating-income",
    category: "3. Net Operating Income",
    level: 0,
    current: 1176, // Updated calculation
    previous: 1109, // Updated calculation
    variance: 67, // Updated calculation
    variancePercent: 6.0, // Updated calculation
    relatedMetrics: ["ROA", "ROE"],
    segment: "Consolidated",
    aiExplanation:
      "Net operating income showed strong growth of 6.0% reflecting the positive operating leverage from revenue growth and controlled expenses.",
    drivers: [
      { name: "Operating Income Growth", value: 81, impact: "positive" },
      { name: "Operating Expense Control", value: -14, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "ADIB Demonstrates Strong Operating Performance",
        url: "https://example.com/news/adib-operating-performance",
      },
    ],
  },
  {
    id: "impairment-charges",
    category: "4. Impairment Charges",
    level: 0,
    current: 285,
    previous: 264,
    variance: 21,
    variancePercent: 8.0,
    segment: "Risk Management",
    aiExplanation:
      "Impairment charges increased moderately due to portfolio growth and prudent provisioning approach. Asset quality remains strong with proactive risk management.",
    drivers: [
      { name: "Portfolio Growth Provisions", value: 15, impact: "negative" },
      { name: "Economic Outlook Adjustment", value: 8, impact: "negative" },
      { name: "Recovery from Previous Provisions", value: -2, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "UAE Banks Maintain Conservative Provisioning",
        url: "https://example.com/news/uae-banks-provisioning",
      },
    ],
  },
  {
    id: "profit-before-tax",
    category: "5. Profit Before Tax (PBT)",
    level: 0,
    current: 891, // Updated calculation
    previous: 845, // Updated calculation
    variance: 46, // Updated calculation
    variancePercent: 5.4, // Updated calculation
    segment: "Consolidated",
    aiExplanation:
      "Profit before tax increased by 5.4% demonstrating the bank's ability to generate sustainable earnings growth while maintaining prudent risk management.",
    drivers: [
      { name: "Net Operating Income Growth", value: 67, impact: "positive" },
      { name: "Higher Impairment Charges", value: -21, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "ADIB Reports Solid Profit Growth",
        url: "https://example.com/news/adib-profit-growth",
      },
    ],
  },
]

export const peerBenchmarkData = [
  { bank: "ADIB", nim: 3.42, roe: 11.2, costToIncome: 58.7 },
  { bank: "FAB", nim: 3.28, roe: 12.8, costToIncome: 56.2 },
  { bank: "ENBD", nim: 3.51, roe: 13.1, costToIncome: 57.9 },
  { bank: "RAKBANK", nim: 4.12, roe: 10.9, costToIncome: 61.4 },
  { bank: "UAE Avg", nim: 3.58, roe: 12.0, costToIncome: 58.6 },
]
