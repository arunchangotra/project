"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/kpi-card"
import { sampleKPIs } from "@/lib/sample-data"
import { BarChart3, TrendingUp, DollarSign } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-gray-600">Get quarterly performance snapshots and KPI summaries</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleKPIs.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              trend={kpi.trend}
              description={kpi.description}
            />
          ))}
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Quarterly Trends</span>
              </CardTitle>
              <CardDescription>Key metrics over the last 4 quarters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Highlights</span>
              </CardTitle>
              <CardDescription>Key achievements this quarter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">NIM Expansion</p>
                  <p className="text-sm text-gray-600">12 bps improvement driven by yield optimization</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Cost Efficiency</p>
                  <p className="text-sm text-gray-600">CIR improved by 180 bps through operational excellence</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Asset Quality</p>
                  <p className="text-sm text-gray-600">NPL ratio decreased to 1.8%, lowest in 3 years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>Automated analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Key Observations</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Strong momentum in SME lending with 24% YoY growth</li>
                <li>• Digital channels now account for 78% of transactions</li>
                <li>• Credit costs remain well-controlled at 0.35% of advances</li>
                <li>• Capital adequacy at 16.8% provides growth flexibility</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
