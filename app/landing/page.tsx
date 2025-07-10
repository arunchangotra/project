import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Calculator,
  FileText,
  Lightbulb,
  Briefcase,
  Activity,
  Target,
  CheckCircle,
  AlertTriangle,
  Search,
  TrendingDown,
  Globe,
  Database,
  MapPin,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-apple-blue-50 to-white overflow-hidden">
        {" "}
        {/* Lighter gradient */}
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            Turn your financial data into strategic insight—<span className="text-apple-blue-700">instantly.</span>{" "}
            {/* Use new blue */}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
            The AI Earnings Assistant helps banking CFOs and FP&A teams automate analysis, explain variances, simulate
            impact, and prepare board-ready insights—faster and smarter than ever before.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-apple-blue-700 hover:bg-apple-blue-800 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <Link href="#">Request a Demo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-apple-blue-700 text-apple-blue-700 hover:bg-apple-blue-50 hover:text-apple-blue-800 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-transparent"
            >
              <Link href="/">
                Explore the Assistant <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Subtle background pattern/gradient for "wow" factor */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-apple-blue-200/20 via-transparent to-transparent animate-pulse-slow"></div>
        </div>
      </section>

      {/* Vision Statement Section - Compact */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-r from-apple-blue-600 to-apple-blue-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-white/80 mr-2" />
            <h2 className="text-base md:text-lg font-semibold text-white/90 tracking-wide uppercase">Our Vision</h2>
          </div>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed max-w-4xl mx-auto">
            To become the CFO's trusted AI partner — transforming financial data into{" "}
            <span className="text-apple-blue-100">clear insights</span>,{" "}
            <span className="text-apple-blue-100">confident decisions</span>, and{" "}
            <span className="text-apple-blue-100">boardroom-ready narratives</span>.
          </p>
        </div>
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="w-full py-20 md:py-28 bg-apple-gray-50">
        {" "}
        {/* Use light gray background */}
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Solving Your Toughest Financial Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-t-4 border-apple-blue-600 rounded-xl">
              {" "}
              {/* More rounded corners */}
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Lightbulb className="h-12 w-12 text-apple-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Manual, Fragmented Earnings Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  CFOs and FP&A teams spend countless hours stitching together financial data from disparate systems.
                  Our AI automates this, providing a unified view.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-t-4 border-apple-blue-600 rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Activity className="h-12 w-12 text-apple-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Peer Comparison Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI provides instant peer comparisons across key metrics, helping you identify competitive
                  positioning and improvement opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-t-4 border-apple-blue-600 rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Briefcase className="h-12 w-12 text-apple-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Time-Consuming Board & Regulator Reporting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Preparing polished narratives and explanations is a burden. Automate report drafting and ensure
                  consistency with AI-powered narratives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Overview Section */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Powerful Features for Financial Foresight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              {" "}
              {/* Lighter hover background */}
              <BarChart3 className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Earnings Dashboard</h3>
                <p className="text-gray-600">
                  Instant quarterly snapshots, KPI cards, and AI-powered summaries for a holistic view.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              <TrendingUp className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Variance Analysis</h3>
                <p className="text-gray-600">
                  Drill down into specific changes with AI-generated explanations and driver breakdowns.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              <MessageSquare className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">CFO Chat Assistant</h3>
                <p className="text-gray-600">
                  Ask natural language questions about financials and get instant, cited answers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              <Calculator className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">What-if Scenario Builder</h3>
                <p className="text-gray-600">
                  Simulate the impact of business levers on key KPIs with real-time projections.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              <FileText className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Board Deck Drafting</h3>
                <p className="text-gray-600">
                  Generate AI-powered narratives for board presentations with customizable tone.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-apple-gray-100 transition-colors duration-200">
              <Activity className="h-8 w-8 text-apple-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Peer Comparison & Benchmarking</h3>
                <p className="text-gray-600">
                  Compare your bank's performance against industry peers with automated benchmarking and competitive
                  positioning insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Roadmap Section */}
      <section className="w-full py-16 md:py-20 bg-apple-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <MapPin className="h-8 w-8 text-apple-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Product Roadmap</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upcoming features designed to make CFOs even more effective and strategic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1 */}
            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <CheckCircle className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Auto-Reconciliation & Integrity Checks</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Reduce reporting errors and data mismatch across sources with automated validation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <AlertTriangle className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Proactive Alerts with Context</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get notified about risks, variances, and key movements with intelligent context.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <Search className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Attribution Analysis (Causal Drivers)</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Know what exactly influenced earnings up/down with deep-dive causal analysis.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Row 2 */}
            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <TrendingDown className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Forecast Accuracy Monitoring</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Build trust and improve planning discipline with continuous forecast monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <Globe className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Macro & Regulatory Sentiment Integration
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Prepare early for external shocks with integrated macro-economic analysis.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-l-4 border-apple-blue-600 rounded-xl bg-white">
              <CardContent className="flex items-start space-x-3 p-0">
                <Database className="h-6 w-6 text-apple-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Integration with CFO Tools (Excel/BI)</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Seamless transition from AI insights to boardroom tools with native integrations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-apple-blue-600 text-apple-blue-600 hover:bg-apple-blue-50 hover:text-apple-blue-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out bg-transparent"
            >
              <Link href="#">
                Request Early Access <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-20 md:py-28 bg-apple-blue-700 text-white text-center">
        {" "}
        {/* Use new blue */}
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Financial Insights?</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Empower your team with AI-driven precision and foresight. Request a demo to see the AI Earnings Assistant in
            action.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-apple-blue-700 hover:bg-apple-blue-50 text-lg px-10 py-4 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <Link href="#">Request a Demo</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="container mx-auto px-4 md:px-6">
          <p>&copy; {new Date().getFullYear()} AI Earnings Assistant. All rights reserved.</p>
          <p className="mt-2">Designed for Banking CFOs & FP&A Teams.</p>
        </div>
      </footer>
    </div>
  )
}
