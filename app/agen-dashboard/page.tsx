"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Zap,
  BarChart3,
  PieChart,
  ArrowRight,
  Sparkles,
  Brain,
  Activity,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AgenDashboard() {
  const performanceData = [
    { month: "Jul", revenue: 2650, profit: 820, efficiency: 92 },
    { month: "Aug", revenue: 2720, profit: 845, efficiency: 94 },
    { month: "Sep", revenue: 2850, profit: 890, efficiency: 96 },
    { month: "Oct", revenue: 2920, profit: 915, efficiency: 97 },
  ]

  const aiInsights = [
    {
      title: "Revenue Optimization",
      description: "AI identified 3 high-impact opportunities",
      impact: "+$45M potential",
      status: "active",
      confidence: 94,
    },
    {
      title: "Cost Efficiency",
      description: "Automated expense categorization complete",
      impact: "-$12M savings",
      status: "completed",
      confidence: 98,
    },
    {
      title: "Risk Assessment",
      description: "Market volatility analysis updated",
      impact: "Medium risk",
      status: "monitoring",
      confidence: 87,
    },
  ]

  const quickActions = [
    { title: "Generate Board Deck", icon: BarChart3, color: "bg-blue-500" },
    { title: "Run Scenario Analysis", icon: Target, color: "bg-green-500" },
    { title: "Peer Comparison", icon: Users, color: "bg-purple-500" },
    { title: "Variance Analysis", icon: Activity, color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Earnings Command Center</h1>
                <p className="text-gray-600">Intelligent financial operations dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                AI Active
              </Badge>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">CF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* AI Status Banner */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Analysis Complete</h3>
                  <p className="text-blue-100">
                    Q3 2024 financial data processed • 47 insights generated • 3 recommendations ready
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                View Report
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$2.85B</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+8.2% YoY</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-2xl font-bold text-gray-900">$890M</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12.5% YoY</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">97%</p>
                  <div className="flex items-center mt-2">
                    <Zap className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600 font-medium">+3% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">58.2%</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">-1.6% YoY</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Performance Trends</CardTitle>
                <p className="text-gray-600 mt-1">Revenue and profit trajectory with AI efficiency overlay</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Real-time
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  revenue: { label: "Revenue ($M)", color: "hsl(217, 91%, 60%)" },
                  profit: { label: "Profit ($M)", color: "hsl(142, 76%, 36%)" },
                  efficiency: { label: "AI Efficiency (%)", color: "hsl(48, 96%, 50%)" },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(217, 91%, 60%)"
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(142, 76%, 36%)"
                      fillOpacity={1}
                      fill="url(#profitGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Insights</span>
              </CardTitle>
              <p className="text-gray-600">Automated analysis and recommendations</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            insight.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : insight.status === "active"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {insight.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {insight.status === "active" && <Activity className="h-3 w-3 mr-1" />}
                          {insight.status === "monitoring" && <Clock className="h-3 w-3 mr-1" />}
                          {insight.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{insight.impact}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <Progress value={insight.confidence} className="w-16 h-2" />
                          <span className="text-xs font-medium text-gray-700">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <p className="text-gray-600">One-click financial operations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow border-gray-200 hover:border-gray-300 bg-transparent"
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-full">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI Automation Ready</h4>
                    <p className="text-sm text-gray-600">3 processes can be automated to save 12 hours/week</p>
                  </div>
                  <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700">
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 min ago", action: "AI completed variance analysis for Q3 2024", status: "success" },
                { time: "15 min ago", action: "Board deck generated with 12 key insights", status: "success" },
                { time: "1 hour ago", action: "Peer comparison updated with latest market data", status: "info" },
                { time: "3 hours ago", action: "Risk assessment flagged CRE exposure increase", status: "warning" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
