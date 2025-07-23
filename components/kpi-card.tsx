import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  change: number
  changeType: "YoY" | "QoQ"
  format?: "currency" | "percentage" | "number"
  suffix?: string
}

export function KPICard({ title, value, change, changeType, format = "number", suffix }: KPICardProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return `$${val}M`
    }
    if (format === "percentage") {
      return `${val}%`
    }
    return `${val}${suffix || ""}`
  }

  const formatChange = (val: number) => {
    const sign = val > 0 ? "+" : ""
    if (format === "percentage" || title.includes("NIM")) {
      return `${sign}${val}bps`
    }
    return `${sign}${val}%`
  }

  return (
    <Card className="shadow-md rounded-xl border-none">
      {" "}
      {/* Softer shadow, more rounded, no default border */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{formatValue(value)}</div> {/* Darker text */}
        <div className="flex items-center space-x-1 text-xs mt-1">
          {" "}
          {/* Adjusted spacing */}
          <span className="text-gray-500">{changeType}:</span>
          <div
            className={cn(
              "flex items-center space-x-1",
              isPositive && "text-green-600",
              isNegative && "text-red-600",
              change === 0 && "text-gray-500",
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            <span>{formatChange(change)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
