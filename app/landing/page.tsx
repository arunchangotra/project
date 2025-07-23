import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calculator, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-apple-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Earnings Intelligence for <span className="text-apple-blue-600">Modern CFOs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your financial analysis with intelligent insights, automated variance analysis, and real-time
            performance monitoring. Make data-driven decisions faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-apple-blue-600 hover:bg-apple-blue-700 text-white px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Financial Leaders</h2>
          <p className="text-lg text-gray-600">Everything you need to analyze, understand, and present your earnings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-apple-blue-600 mb-2" />
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Comprehensive dashboard with key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time KPI tracking</li>
                <li>• Interactive visualizations</li>
                <li>• Trend analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-apple-blue-600 mb-2" />
              <CardTitle>Variance Analysis</CardTitle>
              <CardDescription>Automated analysis of performance variances with AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• QoQ and YoY comparisons</li>
                <li>• Driver identification</li>
                <li>• Impact quantification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Calculator className="h-10 w-10 text-apple-blue-600 mb-2" />
              <CardTitle>What-If Scenarios</CardTitle>
              <CardDescription>Model different scenarios and understand potential impacts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sensitivity analysis</li>
                <li>• Stress testing</li>
                <li>• Forecast modeling</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <FileText className="h-10 w-10 text-apple-blue-600 mb-2" />
              <CardTitle>Board Deck</CardTitle>
              <CardDescription>Generate executive summaries and board-ready presentations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Executive summaries</li>
                <li>• Key insights</li>
                <li>• Presentation ready</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-apple-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Analysis?</h2>
          <p className="text-xl mb-8 text-apple-blue-100">
            Join leading CFOs who are already using AI to drive better financial decisions
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
