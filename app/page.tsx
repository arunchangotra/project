"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import { quarterlyData } from "@/lib/sample-data"
import { financialRatios, type FinancialRatio } from "@/lib/financial-ratios"
import { Search, ArrowDownUp, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation" // Import useRouter

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////
const categories = Array.from(new Set(financialRatios.map((r) => r.category))).sort() // e.g. ["Asset Quality", "Capital Adequacy", …]

const importantRatios = ["ROA", "ROE", "CAR", "CET1", "NPLR", "LDR", "CASA", "PER"]

const formatValue = (val: number, unit: string) => {
  if (unit === "%") return `${val.toFixed(2)}%`
  if (unit === "x") return `${val.toFixed(2)}x`
  if (unit === "$M") return `$${val.toFixed(0)}M`
  if (unit === "$") return `$${val.toFixed(2)}`
  return val.toFixed(2)
}

const formatChange = (val: number, unit: string) => {
  const sign = val > 0 ? "+" : ""
  if (unit === "%") return `${sign}${val.toFixed(1)}%`
  if (unit === "x") return `${sign}${val.toFixed(2)}x`
  if (unit === "$M") return `${sign}$${val.toFixed(0)}M`
  if (unit === "$") return `${sign}$${val.toFixed(2)}`
  return `${sign}${val.toFixed(1)}`
}

////////////////////////////////////////////////////////////////////////////////
// Component
////////////////////////////////////////////////////////////////////////////////
export default function Dashboard() {
  const router = useRouter() // Initialize useRouter

  /* ----------------------------------------------------------------------- */
  /* Local state                                                             */
  /* ----------------------------------------------------------------------- */
  const [showPeerBenchmark, setShowPeerBenchmark] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0]) // default ≠ “All”
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRatio, setSelectedRatio] = useState<FinancialRatio | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  /* ----------------------------------------------------------------------- */
  /* Derived data                                                            */
  /* ----------------------------------------------------------------------- */
  const currentQuarter = quarterlyData[0]

  const trendData = [...quarterlyData] // copy so we can reverse safely
    .reverse()
    .map((q) => ({
      quarter: q.quarter,
      revenue: q.revenue,
      netProfit: q.netProfit,
      nim: q.nim,
    }))

  const dashboardRatios = financialRatios
    .filter((r) => importantRatios.includes(r.id))
    .map((r) => {
      const d = r.historicalData[0]
      return {
        title: r.name,
        value: d.value,
        change: d.yoyChange ?? 0,
        changeType: "YoY",
        format: r.unit === "%" ? "percentage" : r.unit === "x" ? "number" : "currency",
        suffix: r.unit === "x" ? "x" : r.unit === "$M" ? "M" : "",
      }
    })

  const filteredRatios = useMemo(() => {
    let list = financialRatios.filter((r) => r.category === selectedCategory)

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }

    if (sortColumn) {
      list = [...list].sort((a, b) => {
        const av = a.historicalData[0]
        const bv = b.historicalData[0]

        let cmp = 0
        if (sortColumn === "name") cmp = a.name.localeCompare(b.name)
        else if (sortColumn === "value") cmp = av.value - bv.value
        else if (sortColumn === "yoy") cmp = (av.yoyChange ?? 0) - (bv.yoyChange ?? 0)
        else if (sortColumn === "qoq") cmp = (av.qoqChange ?? 0) - (bv.qoqChange ?? 0)
        else if (sortColumn === "ourBank") {
          const aOurBank = a.peerData.find((p) => p.bank === "Our Bank")?.value ?? 0
          const bOurBank = b.peerData.find((p) => p.bank === "Our Bank")?.value ?? 0
          cmp = aOurBank - bOurBank
        } else if (sortColumn === "industryAvg") {
          const aIndustryAvg = a.peerData.find((p) => p.bank === "Industry Avg")?.value ?? 0
          const bIndustryAvg = b.peerData.find((p) => p.bank === "Industry Avg")?.value ?? 0
          cmp = aIndustryAvg - bIndustryAvg
        }

        return sortDirection === "asc" ? cmp : -cmp
      })
    }

    return list
  }, [selectedCategory, searchTerm, sortColumn, sortDirection])

  const toggleSort = (col: string) => {
    if (sortColumn === col) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else {
      setSortColumn(col)
      setSortDirection("asc")
    }
  }

  const handleRowClick = (metricId: string) => {
    router.push(`/variance?metricId=${metricId}`)
  }

  /* ----------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ----------------------------------------------------------------------- */
  return (
    <div className="space-y-10">
      {/* ========== Page Header ========== */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-lg text-gray-600 mt-1">Q3 2024 Financial Performance</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-apple-gray-200 text-gray-700">
          Last Updated: Nov 15 2024
        </Badge>
      </header>

      {/* ========== KPI Snapshot ========== */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quarterly Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <KPICard
            title="Revenue"
            value={currentQuarter.revenue}
            change={currentQuarter.yoyRevenue}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="Net Profit"
            value={currentQuarter.netProfit}
            change={currentQuarter.yoyNetProfit}
            changeType="YoY"
            format="currency"
          />
          <KPICard
            title="NIM"
            value={currentQuarter.nim}
            change={currentQuarter.yoyNim * 100}
            changeType="YoY"
            format="percentage"
          />
          <KPICard
            title="Cost-to-Income"
            value={currentQuarter.costToIncome}
            change={-1.6}
            changeType="YoY"
            format="percentage"
          />
          <KPICard title="EPS" value={currentQuarter.eps} change={currentQuarter.yoyEps} changeType="YoY" />
        </div>
      </section>

      {/* ========== Key Ratios (Cards) ========== */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Key Financial Ratios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardRatios.map((k) => (
            <KPICard key={k.title} {...k} format={k.format as "currency" | "percentage" | "number"} />
          ))}
        </div>
      </section>

      {/* ========== Trend Charts (same as before) ========== */}
      {/* --- omitted for brevity; no functional change here --- */}

      {/* ========== Comprehensive Table ========== */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{selectedCategory} Metrics</h2>

        {/* Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <TabsList className="inline-flex h-auto rounded-full bg-apple-gray-100 p-1 text-gray-700">
              {categories.map((c) => (
                <TabsTrigger
                  key={c}
                  value={c}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-apple-blue-600 data-[state=active]:text-white"
                >
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Tabs>

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-full border-gray-300"
          />
        </div>

        {/* Table */}
        <Card className="shadow-lg rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">{selectedCategory} Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-apple-gray-100 sticky top-0 z-10">
                    {/* Metric */}
                    <TableHead
                      onClick={() => toggleSort("name")}
                      className="cursor-pointer text-gray-700 font-semibold w-[20%]"
                    >
                      <div className="flex items-center gap-1">
                        Metric
                        {sortColumn === "name" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>

                    {/* Current Value */}
                    <TableHead
                      onClick={() => toggleSort("value")}
                      className="cursor-pointer text-right text-gray-700 font-semibold w-[15%]"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Current Value
                        {sortColumn === "value" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>

                    {/* YoY */}
                    <TableHead
                      onClick={() => toggleSort("yoy")}
                      className="cursor-pointer text-right text-gray-700 font-semibold w-[15%]"
                    >
                      <div className="flex items-center justify-end gap-1">
                        YoY
                        {sortColumn === "yoy" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>

                    {/* QoQ */}
                    <TableHead
                      onClick={() => toggleSort("qoq")}
                      className="cursor-pointer text-right text-gray-700 font-semibold w-[15%]"
                    >
                      <div className="flex items-center justify-end gap-1">
                        QoQ
                        {sortColumn === "qoq" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>

                    {/* Our Bank */}
                    <TableHead
                      onClick={() => toggleSort("ourBank")}
                      className="cursor-pointer text-right text-gray-700 font-semibold w-[15%]"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Our Bank
                        {sortColumn === "ourBank" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>

                    {/* Industry Avg */}
                    <TableHead
                      onClick={() => toggleSort("industryAvg")}
                      className="cursor-pointer text-right text-gray-700 font-semibold w-[20%]"
                    >
                      <div className="flex items-center justify-end gap-1">
                        Industry Avg
                        {sortColumn === "industryAvg" && (
                          <ArrowDownUp className={cn("h-3 w-3", sortDirection === "desc" && "rotate-180")} />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRatios.length > 0 ? (
                    filteredRatios.map((ratio) => {
                      const d = ratio.historicalData[0]
                      const posY = (d.yoyChange ?? 0) > 0
                      const posQ = (d.qoqChange ?? 0) > 0

                      const ourBankValue = ratio.peerData.find((p) => p.bank === "Our Bank")?.value ?? 0
                      const industryAvgValue = ratio.peerData.find((p) => p.bank === "Industry Avg")?.value ?? 0

                      return (
                        <TableRow
                          key={ratio.id}
                          className="cursor-pointer hover:bg-apple-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          onClick={() => handleRowClick(ratio.id)} // Add onClick handler
                        >
                          {/* Metric Name */}
                          <TableCell className="font-medium text-gray-800">{ratio.name}</TableCell>

                          {/* Current Value */}
                          <TableCell className="text-right text-gray-700">{formatValue(d.value, ratio.unit)}</TableCell>

                          {/* YoY */}
                          <TableCell className="text-right">
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1",
                                posY ? "text-green-600" : d.yoyChange ? "text-red-600" : "text-gray-500",
                              )}
                            >
                              {d.yoyChange !== 0 &&
                                (posY ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />)}
                              <span>{formatChange(d.yoyChange ?? 0, ratio.unit)}</span>
                            </div>
                          </TableCell>

                          {/* QoQ */}
                          <TableCell className="text-right">
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1",
                                posQ ? "text-green-600" : d.qoqChange ? "text-red-600" : "text-gray-500",
                              )}
                            >
                              {d.qoqChange !== 0 &&
                                (posQ ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />)}
                              <span>{formatChange(d.qoqChange ?? 0, ratio.unit)}</span>
                            </div>
                          </TableCell>

                          {/* Our Bank Value */}
                          <TableCell className="text-right text-gray-700">
                            {formatValue(ourBankValue, ratio.unit)}
                          </TableCell>

                          {/* Industry Avg Value */}
                          <TableCell className="text-right text-gray-700">
                            {formatValue(industryAvgValue, ratio.unit)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        No metrics found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* ========== AI Summary card (unchanged) ========== */}
      <section>
        <Card className="shadow-lg rounded-xl border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">AI Summary</CardTitle>
              <p className="text-gray-600">Automated quarterly performance analysis</p>
            </div>
            <button className="flex items-center space-x-2 rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 13 7 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="13"></line>
                <line x1="12" y1="13" x2="12.01" y2="13"></line>
              </svg>
              <span>Download PDF</span>
            </button>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p>
                <strong>Q3 2024 Performance Summary:</strong> This quarter, revenue rose by 8.2% YoY to $2.85B, driven
                primarily by retail deposit inflows and improved lending margins in the SME segment. Net profit
                increased 12.5% YoY to $890M, benefiting from strong fee income growth and disciplined cost management.
                Net Interest Margin improved 8bps QoQ to 3.45%, reflecting successful repricing of the loan portfolio
                amid rising rate environment.
              </p>
              <p className="mt-4">
                <strong>Key Highlights:</strong> Cost-to-income ratio improved to 58.2% from 59.8% in Q2, demonstrating
                operational efficiency gains. However, loan loss provisions increased 27.6% QoQ due to cautious stance
                on commercial real estate exposure. EPS grew 11.8% YoY to $4.25, exceeding analyst expectations of
                $4.10.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
