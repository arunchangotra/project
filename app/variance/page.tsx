import { ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"
import ChartContainer from "./ChartContainer"
import ChartTooltipContent from "./ChartTooltipContent"

const VariancePage = () => {
  const historicalData = [
    { period: "Q1", nim: 5, roa: 10 },
    { period: "Q2", nim: 6, roa: 11 },
    { period: "Q3", nim: 7, roa: 12 },
    { period: "Q4", nim: 8, roa: 13 },
  ]

  const peerComparisonData = [
    { bank: "Bank A", current: 5, yoy: 10 },
    { bank: "Bank B", current: 6, yoy: 11 },
    { bank: "Bank C", current: 7, yoy: 12 },
    { bank: "Bank D", current: 8, yoy: 13 },
  ]

  return (
    <div className="page">
      <h1>Variance Analysis</h1>
      <section className="historical-trend-chart">
        <ChartContainer
          config={{
            nim: { label: "Net Interest Margin", color: "hsl(var(--chart-1))" },
            roa: { label: "Return on Assets", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} width={60} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="nim" stroke="var(--color-nim)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="roa" stroke="var(--color-roa)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </section>
      <section className="peer-comparison-chart">
        <ChartContainer
          config={{
            current: { label: "Current Period", color: "hsl(var(--chart-1))" },
            yoy: { label: "YoY Change", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="bank"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} width={60} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar dataKey="yoy" fill="var(--color-yoy)" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </section>
      {/* rest of code here */}
    </div>
  )
}

export default VariancePage
