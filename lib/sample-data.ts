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

export const quarterlyData: QuarterlyMetrics[] = [
  {
    quarter: "Q3 2024",
    revenue: 2850,
    netProfit: 890,
    nim: 3.45,
    costToIncome: 58.2,
    eps: 4.25,
    yoyRevenue: 8.2,
    qoqRevenue: 3.1,
    yoyNetProfit: 12.5,
    qoqNetProfit: 5.8,
    yoyNim: -0.15,
    qoqNim: 0.08,
    yoyEps: 11.8,
    qoqEps: 4.9,
  },
  {
    quarter: "Q2 2024",
    revenue: 2765,
    netProfit: 842,
    nim: 3.37,
    costToIncome: 59.8,
    eps: 4.05,
    yoyRevenue: 6.8,
    qoqRevenue: 2.4,
    yoyNetProfit: 9.2,
    qoqNetProfit: 3.1,
    yoyNim: -0.22,
    qoqNim: -0.05,
    yoyEps: 8.9,
    qoqEps: 2.8,
  },
  {
    quarter: "Q1 2024",
    revenue: 2700,
    netProfit: 816,
    nim: 3.42,
    costToIncome: 61.2,
    eps: 3.94,
    yoyRevenue: 5.2,
    qoqRevenue: 1.8,
    yoyNetProfit: 7.8,
    qoqNetProfit: 2.5,
    yoyNim: -0.18,
    qoqNim: 0.12,
    yoyEps: 7.1,
    qoqEps: 2.2,
  },
  {
    quarter: "Q4 2023",
    revenue: 2652,
    netProfit: 796,
    nim: 3.3,
    costToIncome: 62.5,
    eps: 3.86,
    yoyRevenue: 4.1,
    qoqRevenue: 0.9,
    yoyNetProfit: 6.2,
    qoqNetProfit: 1.8,
    yoyNim: -0.25,
    qoqNim: -0.08,
    yoyEps: 5.8,
    qoqEps: 1.5,
  },
]

export const detailedVarianceData: LineItem[] = [
  {
    id: "operating-income",
    category: "1. Operating Income",
    level: 0,
    current: 2730, // Hardcoded from image
    previous: 2655, // Hardcoded from image
    variance: 75, // Hardcoded from image
    variancePercent: 2.8, // Hardcoded from image
    relatedMetrics: ["CTI", "ORG"],
    segment: "Consolidated",
    aiExplanation:
      "Overall performance of core banking operations, encompassing both interest and non-interest revenue streams. This quarter saw robust growth driven by strong lending activity and favorable market conditions for non-interest income.",
    drivers: [
      { name: "Net Interest Income Growth", value: 55, impact: "positive" },
      { name: "Fee Income Resilience", value: 20, impact: "positive" },
      { name: "Market Volatility (FX)", value: 15, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Banking Sector Reports Strong Q3 Earnings",
        url: "https://example.com/news/banking-q3-earnings",
      },
      {
        title: "Interest Rate Environment Boosts Bank Profits",
        url: "https://example.com/news/interest-rate-impact",
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
      "Revenue generated from interest-earning assets, including loans to banks and customers, and investment securities. The increase reflects effective asset deployment and repricing strategies.",
    drivers: [
      { name: "Loan Book Growth", value: 60, impact: "positive" },
      { name: "Yield on Earning Assets", value: 30, impact: "positive" },
      { name: "Deposit Cost Management", value: -20, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Loan Growth Continues Across Key Segments",
        url: "https://example.com/news/loan-growth",
      },
      {
        title: "Central Bank Policy Impacts Lending Rates",
        url: "https://example.com/news/central-bank-policy",
      },
    ],
  },
  {
    id: "interest-income-banks-p1",
    category: "1.1.1 Interest income -To Banks/Product 1",
    level: 2,
    current: 500,
    previous: 480,
    variance: 20,
    variancePercent: 4.2,
    aiExplanation: "Growth in interbank lending due to increased liquidity demand.",
    segment: "Treasury",
    drivers: [
      { name: "Interbank Loan Volume", value: 15, impact: "positive" },
      { name: "Average Interbank Rate", value: 5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Central Bank Raises Benchmark Rate",
        url: "https://example.com/news/central-bank-rate-hike",
      },
      {
        title: "Interbank Lending Market Activity Increases",
        url: "https://example.com/news/interbank-activity",
      },
    ],
  },
  {
    id: "interest-income-banks-p2",
    category: "1.1.1a Interest income -To Banks/Product 2",
    level: 2,
    current: 350,
    previous: 340,
    variance: 10,
    variancePercent: 2.9,
    aiExplanation: "Stable performance in short-term bank placements.",
    segment: "Treasury",
    drivers: [
      { name: "Short-term Placement Volume", value: 7, impact: "positive" },
      { name: "Yield on Placements", value: 3, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Money Market Rates Remain Stable",
        url: "https://example.com/news/money-market-stable",
      },
    ],
  },
  {
    id: "interest-income-customers-p1",
    category: "1.1.2 Interest income -To Customers /Product 1",
    level: 2,
    current: 700,
    previous: 650,
    variance: 50,
    variancePercent: 7.7,
    aiExplanation: "Strong growth in retail mortgage portfolio, driven by new originations.",
    segment: "Retail",
    drivers: [
      { name: "New Mortgage Originations", value: 30, impact: "positive" },
      { name: "Average Loan Yield", value: 20, impact: "positive" },
      { name: "Prepayments", value: -5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Housing Market Sees Surge in Q3",
        url: "https://example.com/news/housing-market-surge",
      },
      {
        title: "Bank Launches New Mortgage Product",
        url: "https://example.com/news/new-mortgage-product",
      },
    ],
  },
  {
    id: "interest-income-customers-p2",
    category: "1.1.2a Interest income -To Customers /Product 2",
    level: 2,
    current: 300,
    previous: 310,
    variance: -10,
    variancePercent: -3.2,
    aiExplanation: "Slight decline in corporate loan interest due to competitive repricing.",
    segment: "Corporate",
    drivers: [
      { name: "Corporate Loan Volume", value: -15, impact: "negative" },
      { name: "Competitive Repricing", value: 5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Corporate Lending Market Becomes More Competitive",
        url: "https://example.com/news/corporate-lending-competition",
      },
    ],
  },
  {
    id: "investment-securities",
    category: "1.1.3 Investment Securities",
    level: 2,
    current: 180,
    previous: 170,
    variance: 10,
    variancePercent: 5.9,
    aiExplanation: "Increased yield on fixed income portfolio.",
    segment: "Treasury",
    drivers: [
      { name: "Fixed Income Yields", value: 8, impact: "positive" },
      { name: "Portfolio Rebalancing", value: 2, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Bond Market Yields Rise in Q3",
        url: "https://example.com/news/bond-yields-rise",
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
      "Income derived from non-lending activities, such as fees, foreign exchange, and investment properties. This segment showed resilience despite some headwinds in specific fee categories.",
    drivers: [
      { name: "FX Income Growth", value: 15, impact: "positive" },
      { name: "Fees & Commission Decline", value: -25, impact: "negative" },
      { name: "Investment Property Gains", value: 5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Global Currency Markets See Increased Volatility",
        url: "https://example.com/news/fx-volatility",
      },
      {
        title: "Regulatory Changes Impact Bank Fee Income",
        url: "https://example.com/news/fee-income-regulations",
      },
    ],
  },
  {
    id: "fees-commission",
    category: "1.2.1 Fees & Commission",
    level: 2,
    current: 420,
    previous: 445,
    variance: -25,
    variancePercent: -5.6,
    aiExplanation: "Decline in card interchange fees due to regulatory changes and reduced transaction volumes.",
    segment: "Retail",
    drivers: [
      { name: "Card Interchange Fees", value: -30, impact: "negative" },
      { name: "Service Charges", value: 5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "New Regulations Impact Card Fees",
        url: "https://example.com/news/card-fee-regulations",
      },
      {
        title: "Consumer Spending Trends Shift",
        url: "https://example.com/news/consumer-spending",
      },
    ],
  },
  {
    id: "fx-income",
    category: "1.2.2 FX",
    level: 2,
    current: 180,
    previous: 165,
    variance: 15,
    variancePercent: 9.1,
    aiExplanation: "Strong performance in FX trading amid market volatility.",
    segment: "Treasury",
    drivers: [
      { name: "Currency Volatility", value: 10, impact: "positive" },
      { name: "Client FX Transactions", value: 5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Geopolitical Events Drive Currency Swings",
        url: "https://example.com/news/geopolitical-fx",
      },
    ],
  },
  {
    id: "investment-properties",
    category: "1.2.3 Investment Properties",
    level: 2,
    current: 50,
    previous: 45,
    variance: 5,
    variancePercent: 11.1,
    aiExplanation: "Rental income growth from real estate portfolio.",
    segment: "Other",
    drivers: [
      { name: "Occupancy Rates", value: 3, impact: "positive" },
      { name: "Rental Yields", value: 2, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Real Estate Market Shows Resilience",
        url: "https://example.com/news/real-estate-resilience",
      },
    ],
  },
  {
    id: "dividend-income",
    category: "1.2.4 Dividend Income",
    level: 2,
    current: 30,
    previous: 28,
    variance: 2,
    variancePercent: 7.1,
    aiExplanation: "Higher dividends from equity investments.",
    segment: "Treasury",
    drivers: [{ name: "Equity Portfolio Performance", value: 2, impact: "positive" }],
    newsArticles: [
      {
        title: "Stock Market Performance Boosts Dividends",
        url: "https://example.com/news/stock-market-dividends",
      },
    ],
  },
  {
    id: "other-income",
    category: "1.2.5 Other Income",
    level: 2,
    current: 20,
    previous: 22,
    variance: -2,
    variancePercent: -9.1,
    aiExplanation: "Minor fluctuations in miscellaneous income streams.",
    segment: "Other",
    drivers: [{ name: "Miscellaneous Adjustments", value: -2, impact: "negative" }],
    newsArticles: [
      {
        title: "Minor Income Adjustments Noted in Q3",
        url: "https://example.com/news/minor-income-adjustments",
      },
    ],
  },
  {
    id: "operating-expenses",
    category: "2. Operating Expenses",
    level: 0,
    current: 1540, // Hardcoded from image
    previous: 1492, // Hardcoded from image
    variance: 48, // Hardcoded from image
    variancePercent: 3.2, // Hardcoded from image
    relatedMetrics: ["CTI", "ER"],
    segment: "Consolidated",
    aiExplanation:
      "Total costs incurred in running the bank's operations, including both interest and non-interest expenses. Effective cost management initiatives contributed to an improved efficiency ratio this quarter.",
    drivers: [
      { name: "Interest Expense Increase", value: 45, impact: "negative" },
      { name: "Employee Costs", value: 10, impact: "negative" },
      { name: "General & Admin Savings", value: -10, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Inflationary Pressures Impact Operating Costs",
        url: "https://example.com/news/inflation-costs",
      },
      {
        title: "Banks Focus on Cost Optimization",
        url: "https://example.com/news/cost-optimization",
      },
    ],
  },
  {
    id: "interest-expense",
    category: "2.1 Interest Expense",
    level: 1,
    relatedMetrics: ["NIM", "ER"],
    segment: "Funding Costs",
    aiExplanation:
      "Costs associated with funding the bank's operations, primarily from deposits and borrowings. Rising interest rates led to an increase in funding costs, impacting net interest margin.",
    drivers: [
      { name: "Deposit Rate Hikes", value: 20, impact: "negative" },
      { name: "Interbank Funding Costs", value: 15, impact: "negative" },
      { name: "Borrowing Costs", value: 10, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Deposit Competition Heats Up Among Banks",
        url: "https://example.com/news/deposit-competition-rates",
      },
      {
        title: "Central Bank Tightens Monetary Policy",
        url: "https://example.com/news/monetary-policy",
      },
    ],
  },
  {
    id: "interest-expense-banks-p1",
    category: "2.1.1 Interest expense -To Banks/Product 1",
    level: 2,
    current: 200,
    previous: 190,
    variance: 10,
    variancePercent: 5.3,
    aiExplanation: "Increased cost of interbank borrowings.",
    segment: "Treasury",
    drivers: [
      { name: "Interbank Borrowing Rates", value: 7, impact: "negative" },
      { name: "Volume of Interbank Borrowings", value: 3, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Short-term Funding Costs Rise",
        url: "https://example.com/news/short-term-funding",
      },
    ],
  },
  {
    id: "interest-expense-banks-p2",
    category: "2.1.1a Interest expense -To Banks/Product 2",
    level: 2,
    current: 150,
    previous: 145,
    variance: 5,
    variancePercent: 3.4,
    aiExplanation: "Higher rates on short-term funding.",
    segment: "Treasury",
    drivers: [{ name: "Repo Rates", value: 5, impact: "negative" }],
    newsArticles: [
      {
        title: "Repo Market Sees Rate Adjustments",
        url: "https://example.com/news/repo-market",
      },
    ],
  },
  {
    id: "interest-expense-customers-p1",
    category: "2.1.2 Interest expense -To Customers/Product 1",
    level: 2,
    current: 250,
    previous: 230,
    variance: 20,
    variancePercent: 8.7,
    aiExplanation: "Rising deposit costs due to competitive market conditions.",
    segment: "Retail",
    drivers: [
      { name: "Deposit Rate Increases", value: 15, impact: "negative" },
      { name: "Deposit Volume Growth", value: 5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Banks Compete for Deposits Amid Rate Hikes",
        url: "https://example.com/news/deposit-competition",
      },
      {
        title: "Consumer Savings Behavior Shifts",
        url: "https://example.com/news/consumer-savings",
      },
    ],
  },
  {
    id: "interest-expense-customers-p2",
    category: "2.1.2a Interest expense -To Customers/Product 2",
    level: 2,
    current: 80,
    previous: 80,
    variance: 0,
    variancePercent: 0,
    aiExplanation: "Stable cost of corporate deposits.",
    segment: "Corporate",
    drivers: [{ name: "Corporate Deposit Rates", value: 0, impact: "neutral" }],
    newsArticles: [
      {
        title: "Corporate Funding Costs Remain Flat",
        url: "https://example.com/news/corporate-funding-flat",
      },
    ],
  },
  {
    id: "borrowings",
    category: "2.1.3 Borrowings",
    level: 2,
    current: 100,
    previous: 90,
    variance: 10,
    variancePercent: 11.1,
    aiExplanation: "Increased cost of long-term debt.",
    segment: "Treasury",
    drivers: [
      { name: "Long-term Debt Issuance", value: 5, impact: "negative" },
      { name: "Market Interest Rates", value: 5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Corporate Bond Yields Increase",
        url: "https://example.com/news/corporate-bond-yields",
      },
    ],
  },
  {
    id: "non-interest-expense",
    category: "2.2 Non-Interest Expense",
    level: 1,
    relatedMetrics: ["ER", "CTI"],
    segment: "Operational",
    aiExplanation:
      "Expenses related to the general running of the bank, excluding interest payments. This includes personnel costs, administrative overheads, and depreciation, reflecting the efficiency of non-core operations.",
    drivers: [
      { name: "Employee Costs", value: 10, impact: "negative" },
      { name: "General & Admin Savings", value: -10, impact: "positive" },
      { name: "Technology Investments", value: 5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Banks Invest Heavily in Digital Transformation",
        url: "https://example.com/news/digital-transformation",
      },
      {
        title: "Workforce Management Strategies Evolve",
        url: "https://example.com/news/workforce-management",
      },
    ],
  },
  {
    id: "employee-costs",
    category: "2.2.1 Employee Costs",
    level: 2,
    current: 400,
    previous: 390,
    variance: 10,
    variancePercent: 2.6,
    aiExplanation: "Annual salary increments and new hires in key growth areas.",
    segment: "Operational",
    drivers: [
      { name: "New Hires (FTE)", value: 5, impact: "negative" },
      { name: "Salary Adjustments", value: 5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Talent Acquisition Remains Key for Banks",
        url: "https://example.com/news/talent-acquisition",
      },
    ],
  },
  {
    id: "general-admin",
    category: "2.2.2 General & Admin",
    level: 2,
    current: 250,
    previous: 260,
    variance: -10,
    variancePercent: -3.8,
    aiExplanation: "Cost optimization initiatives and reduced travel expenses.",
    segment: "Operational",
    drivers: [
      { name: "Travel & Entertainment", value: -5, impact: "positive" },
      { name: "Software Subscriptions", value: -5, impact: "positive" },
    ],
    newsArticles: [
      {
        title: "Companies Embrace Remote Work, Reduce Office Costs",
        url: "https://example.com/news/remote-work-costs",
      },
    ],
  },
  {
    id: "depreciation",
    category: "2.2.3 Depreciation",
    level: 2,
    current: 80,
    previous: 78,
    variance: 2,
    variancePercent: 2.6,
    aiExplanation: "Standard depreciation on fixed assets.",
    segment: "Operational",
    drivers: [{ name: "New Asset Additions", value: 2, impact: "negative" }],
    newsArticles: [
      {
        title: "Bank Expands IT Infrastructure",
        url: "https://example.com/news/it-infrastructure",
      },
    ],
  },
  {
    id: "amortization-intangibles",
    category: "2.2.4 Amortization of intangible assets",
    level: 2,
    current: 30,
    previous: 29,
    variance: 1,
    variancePercent: 3.4,
    aiExplanation: "Amortization of software licenses and acquired intangibles.",
    segment: "Operational",
    drivers: [{ name: "Software License Costs", value: 1, impact: "negative" }],
    newsArticles: [
      {
        title: "Investment in Digital Platforms Continues",
        url: "https://example.com/news/digital-platform-investment",
      },
    ],
  },
  {
    id: "net-income",
    category: "3. Net Income",
    level: 0,
    current: 170, // Hardcoded from image
    previous: 138, // Hardcoded from image
    variance: 32, // Hardcoded from image
    variancePercent: 23.2, // Hardcoded from image
    relatedMetrics: ["ROA", "ROE", "PER"],
    segment: "Consolidated",
    aiExplanation:
      "The bank's total earnings after all revenues and expenses, but before impairment charges and taxes. This figure provides a clear view of operational profitability.",
    drivers: [
      { name: "Operating Income Growth", value: 75, impact: "positive" },
      { name: "Operating Expense Increase", value: -48, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Bank Reports Strong Net Income Growth",
        url: "https://example.com/news/net-income-growth",
      },
    ],
  },
  {
    id: "impairment-charges",
    category: "4. Impairment Charges",
    level: 0,
    segment: "Risk Management",
    aiExplanation:
      "Provisions made for potential credit losses and actual loan write-offs. This reflects the bank's assessment of asset quality and its proactive approach to managing credit risk in the portfolio.",
    drivers: [
      { name: "Loan Loss Provisions", value: 27, impact: "negative" },
      { name: "Net Charge-Offs", value: 5, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Banks Increase Loan Loss Provisions Amid Economic Uncertainty",
        url: "https://example.com/news/loan-loss-provisions",
      },
      {
        title: "Credit Quality Trends in Banking Sector",
        url: "https://example.com/news/credit-quality-trends",
      },
    ],
  },
  {
    id: "loan-loss-provisions",
    category: "4.1 Loan Loss Provisions", // Corrected prefix
    level: 1,
    current: 125,
    previous: 98,
    variance: 27,
    variancePercent: 27.6,
    aiExplanation: "Increased provisions for commercial real estate exposure and economic uncertainty.",
    segment: "Corporate",
    relatedMetrics: ["PCR"],
    drivers: [
      { name: "Commercial Real Estate Exposure", value: 18, impact: "negative" },
      { name: "Economic Outlook Adjustment", value: 7, impact: "negative" },
      { name: "Specific Provisions", value: 2, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Commercial Real Estate Market Faces Headwinds",
        url: "https://example.com/news/cre-headwinds",
      },
      {
        title: "Regulators Urge Caution on Credit Risk",
        url: "https://example.com/news/credit-risk-caution",
      },
    ],
  },
  {
    id: "net-charge-offs",
    category: "4.2 Net Charge-Offs", // Corrected prefix
    level: 1,
    current: 45,
    previous: 40,
    variance: 5,
    variancePercent: 12.5,
    aiExplanation: "Slight increase in write-offs from consumer lending.",
    segment: "Retail",
    relatedMetrics: ["NCOR"],
    drivers: [{ name: "Consumer Loan Write-offs", value: 5, impact: "negative" }],
    newsArticles: [
      {
        title: "Consumer Credit Performance Under Scrutiny",
        url: "https://example.com/news/consumer-credit",
      },
    ],
  },
  {
    id: "profit-before-tax",
    category: "5. Profit Before Tax (PBT)",
    level: 0,
    // Values will be calculated dynamically in page.tsx
    segment: "Consolidated",
    aiExplanation:
      "The bank's profitability before the deduction of income taxes. This is a key indicator of financial health and operational success before tax implications.",
    drivers: [
      { name: "Net Income Before Impairment", value: 32, impact: "positive" },
      { name: "Impairment Charges", value: -32, impact: "negative" }, // Sum of 4.1 and 4.2
    ],
    newsArticles: [
      {
        title: "Bank's Pre-Tax Profitability Shows Resilience",
        url: "https://example.com/news/pbt-resilience",
      },
    ],
  },
  {
    id: "income-tax",
    category: "6. Income Tax",
    level: 0,
    current: 90, // Hardcoded from image
    previous: 83, // Hardcoded from image
    variance: 7, // Hardcoded from image
    variancePercent: 8.4, // Hardcoded from image
    relatedMetrics: ["Total Tax / PBT"], // This is a custom metric, not in financialRatios.ts
    segment: "Taxation",
    aiExplanation:
      "The total tax expense incurred by the bank, including both current and deferred tax components. This reflects the tax burden on the bank's earnings.",
    drivers: [
      { name: "Higher Profit Before Tax", value: 5, impact: "negative" },
      { name: "Deferred Tax Adjustments", value: 2, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Corporate Tax Rates Remain Stable",
        url: "https://example.com/news/corporate-tax-stable",
      },
    ],
  },
  {
    id: "current-tax",
    category: "6.1 Current Tax",
    level: 1,
    current: 80,
    previous: 75,
    variance: 5,
    variancePercent: 6.7,
    aiExplanation: "Higher current tax due to increased profitability.",
    segment: "Operational",
    drivers: [{ name: "Taxable Income Increase", value: 5, impact: "negative" }],
    newsArticles: [
      {
        title: "Tax Authorities Review Corporate Filings",
        url: "https://example.com/news/tax-filings",
      },
    ],
  },
  {
    id: "deferred-tax",
    category: "6.2 Deferred Tax",
    level: 1,
    current: 10,
    previous: 8,
    variance: 2,
    variancePercent: 25.0,
    aiExplanation: "Impact of temporary differences in accounting and tax treatment.",
    segment: "Operational",
    drivers: [{ name: "Temporary Differences", value: 2, impact: "negative" }],
    newsArticles: [
      {
        title: "Accounting Standard Changes Affect Deferred Tax",
        url: "https://example.com/news/deferred-tax-changes",
      },
    ],
  },
  {
    id: "profit-after-tax",
    category: "7. Profit After Tax (PAT)",
    level: 0,
    // Values will be calculated dynamically in page.tsx
    relatedMetrics: ["PAT / Operating Income", "ROE", "ROA"], // ROE and ROA are already in financialRatios.ts
    segment: "Consolidated",
    aiExplanation:
      "The ultimate measure of the bank's profitability, representing the net earnings available to shareholders after all expenses and taxes. This is the bottom-line performance indicator.",
    drivers: [
      { name: "Profit Before Tax Growth", value: 25, impact: "positive" }, // Example, will be dynamic
      { name: "Income Tax Expense", value: -7, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Bank's Net Profit Exceeds Expectations",
        url: "https://example.com/news/pat-exceeds-expectations",
      },
    ],
  },
  {
    id: "earnings-per-share",
    category: "8. Earnings per Share",
    level: 0,
    current: 214.15, // Hardcoded from image
    previous: 208.95, // Hardcoded from image
    variance: 5.2, // Hardcoded from image (rounded from 5.200000000000017)
    variancePercent: 2.5, // Hardcoded from image
    relatedMetrics: ["PER", "PAT / Weighted Shares"], // PER is in financialRatios.ts
    segment: "Shareholder Value",
    aiExplanation:
      "A key metric for investors, representing the portion of a company's profit allocated to each outstanding share of common stock. It reflects the bank's profitability on a per-share basis.",
    drivers: [
      { name: "Profit After Tax Growth", value: 0.2, impact: "positive" }, // Example, will be dynamic
      { name: "Share Dilution", value: -0.05, impact: "negative" },
    ],
    newsArticles: [
      {
        title: "Bank's EPS Growth Attracts Investors",
        url: "https://example.com/news/eps-investors",
      },
    ],
  },
  {
    id: "weighted-equity-shares",
    category: "8.1 Weighted Number of Equity Shares",
    level: 1,
    current: 210,
    previous: 205,
    variance: 5,
    variancePercent: 2.4,
    aiExplanation: "Increase due to new share issuance for employee stock options.",
    segment: "Operational",
    drivers: [{ name: "Employee Stock Option Exercise", value: 5, impact: "negative" }],
    newsArticles: [
      {
        title: "Employee Stock Plans Impact Share Count",
        url: "https://example.com/news/employee-stock-plans",
      },
    ],
  },
  {
    id: "diluted-eps",
    category: "8.2 Diluted Earnings per Share",
    level: 1,
    current: 4.15,
    previous: 3.95,
    variance: 0.2,
    variancePercent: 5.1,
    aiExplanation: "Reflects potential dilution from convertible securities.",
    segment: "Operational",
    relatedMetrics: ["PAT / Diluted Shares"], // Custom metric
    drivers: [{ name: "Convertible Securities Impact", value: 0.2, impact: "negative" }],
    newsArticles: [
      {
        title: "Convertible Debt Issuance Affects EPS",
        url: "https://example.com/news/convertible-debt",
      },
    ],
  },
]

export const peerBenchmarkData = [
  { bank: "Our Bank", nim: 3.45, roe: 12.8, costToIncome: 58.2 },
  { bank: "Peer A", nim: 3.52, roe: 13.2, costToIncome: 56.8 },
  { bank: "Peer B", nim: 3.38, roe: 12.1, costToIncome: 61.5 },
  { bank: "Peer C", nim: 3.41, roe: 12.9, costToIncome: 59.1 },
  { bank: "Industry Avg", nim: 3.44, roe: 12.7, costToIncome: 58.9 },
]
