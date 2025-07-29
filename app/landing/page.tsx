import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, BarChart3, FileText, Calculator, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-apple-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-12 w-12 text-apple-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Earnings Assistant</h1>
            <span className="px-3 py-1 text-sm font-medium bg-apple-blue-100 text-apple-blue-700 rounded-full">
              BETA
            </span>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your financial analysis with AI-powered insights for banking earnings, variance analysis, and
            strategic planning.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/">
              <Button size="lg" className="bg-apple-blue-600 hover:bg-apple-blue-700">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>
                Get quarterly performance snapshots and KPI summaries with AI-powered insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>Variance Analysis</CardTitle>
              <CardDescription>
                Drill down into specific changes with AI explanations and trend analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>What-If Scenarios</CardTitle>
              <CardDescription>Simulate impact of business levers on key financial metrics</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>Board Deck Drafting</CardTitle>
              <CardDescription>Generate AI-powered narratives and presentations for stakeholders</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>Peer Benchmarking</CardTitle>
              <CardDescription>Compare performance against industry peers and best practices</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-apple-blue-600 mb-2" />
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Review NPL ratios, provisions, and asset quality metrics</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to transform your financial analysis?</h2>
          <p className="text-gray-600 mb-6">
            Join leading CFOs who are already using AI to drive better financial insights.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-apple-blue-600 hover:bg-apple-blue-700">
              Start Your Analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
