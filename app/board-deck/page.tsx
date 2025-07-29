"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, MessageSquareText, Settings2, Upload, FileText, Download, MessageSquare } from "lucide-react" // Import Settings2 for the settings icon
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Import Input for target word count
import { Label } from "@/components/ui/label" // Import Label
import { MetricMultiSelect } from "@/components/metric-multi-select" // Re-use multi-select
import { financialRatios } from "@/lib/financial-ratios" // Import financial ratios
import Link from "next/link"

// Helper function to convert markdown-like content to HTML
const convertMarkdownToHtml = (markdown: string): string => {
  const html = markdown
    // Convert headers - more specific patterns
    .replace(
      /^\*\*([^*\n]+)\*\*$/gm,
      '<h1 style="color: #1f2937; font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 1rem 0; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem;">$1</h1>',
    )
    .replace(
      /^\*\*(\d+\.\s[^*\n]+)\*\*$/gm,
      '<h2 style="color: #374151; font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem 0;">$1</h2>',
    )
    // Convert bold text (not headers)
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong style="color: #1f2937; font-weight: 600;">$1</strong>')
    // Convert italic text
    .replace(/\*([^*\n]+)\*/g, '<em style="font-style: italic;">$1</em>')
    // Convert bullet points with better spacing
    .replace(/^\*\s+(.+)$/gm, '<li style="margin-bottom: 0.5rem; line-height: 1.6;">$1</li>')
    // Wrap consecutive list items in ul tags with proper styling
    .replace(
      /(<li[^>]*>.*?<\/li>(\s*<li[^>]*>.*?<\/li>)*)/gs,
      '<ul style="margin: 1rem 0; padding-left: 1.5rem; list-style-type: disc;">$1</ul>',
    )
    // Convert paragraphs with proper spacing
    .split("\n\n")
    .map((paragraph) => {
      const trimmed = paragraph.trim()
      if (trimmed && !trimmed.includes("<h") && !trimmed.includes("<ul>") && !trimmed.includes("<li>")) {
        return `<p style="margin: 1rem 0; line-height: 1.7; color: #374151;">${trimmed}</p>`
      }
      return trimmed
    })
    .join("\n")
    // Highlight financial figures with better styling
    .replace(
      /\$[\d,]+\.?\d*[MB]?/g,
      '<span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-weight: 600;">$&</span>',
    )
    .replace(
      /\d+\.\d+%/g,
      '<span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-weight: 600;">$&</span>',
    )
    .replace(
      /\+\d+\.\d+%/g,
      '<span style="background-color: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 600;">$&</span>',
    )
    .replace(
      /-\d+\.\d+%/g,
      '<span style="background-color: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-weight: 600;">$&</span>',
    )

  return html
}

export default function BoardDeckDrafting() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q3 2024")
  const [selectedTone, setSelectedTone] = useState("Executive")
  const [userPrompt, setUserPrompt] = useState("")
  const [targetWordCount, setTargetWordCount] = useState<number | string>(1000) // New state for target word count
  const [selectedAudience, setSelectedAudience] = useState("Board of Directors") // New state for audience
  const [selectedKeyMetrics, setSelectedKeyMetrics] = useState<Set<string>>(new Set(["NIM", "ROE"])) // Reduced default selected key metrics
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<string | null>(null)

  const defaultExecutiveContent = `**Q3 2024 Financial Performance Summary: Driving Sustainable Growth**

**1. Executive Overview**
The Bank delivered a robust financial performance in Q3 2024, demonstrating resilience and strategic execution amidst evolving market dynamics. Revenue surged by **8.2% YoY** to **$2.85 Billion**, primarily fueled by strong lending activity and an optimized net interest margin. Net Profit increased by a significant **12.5% YoY** to **$890 Million**, reflecting effective cost management and a disciplined approach to risk. Our strategic initiatives in digital transformation and SME lending continue to yield positive results, positioning us for sustained growth.

**2. Key Financial Highlights**
*   **Revenue:** $2.85B (+8.2% YoY, +3.1% QoQ) - *Strong growth across core segments.*
*   **Net Profit:** $890M (+12.5% YoY, +5.8% QoQ) - *Exceeding expectations through operational efficiency.*
*   **Net Interest Margin (NIM):** 3.45% (+8bps QoQ) - *Benefiting from strategic repricing and favorable rate environment.*
*   **Cost-to-Income Ratio:** 58.2% (improved from 59.8% in Q2) - *Reflecting ongoing cost optimization efforts.*
*   **Earnings Per Share (EPS):** $4.25 (+11.8% YoY) - *Delivering enhanced shareholder value.*
*   **Capital Adequacy (CET1):** 12.1% - *Maintaining strong capital buffers.*

**3. Strategic Progress & Business Segment Performance**
*   **Retail Banking:** Continued momentum with SME loan growth of **12% QoQ**. Digital adoption rates increased by 15%, enhancing customer experience and operational efficiency.
*   **Corporate Banking:** Stable performance with targeted growth in key sectors. Focus on high-quality credit origination.
*   **Treasury & Markets:** Strong contribution from FX trading activities amidst market volatility, offsetting some pressures in investment securities.

**4. Risk Management & Asset Quality**
We maintained a prudent approach to credit risk, with Loan Loss Provisions of **$125M** reflecting a cautious stance on specific exposures, particularly in commercial real estate. Overall credit quality remains stable, with the NPL ratio at 1.8%. Our robust risk frameworks ensure proactive identification and mitigation of emerging risks.

**5. Outlook & Priorities**
We remain confident in our ability to navigate future challenges and capitalize on growth opportunities. Key priorities include:
*   Accelerating digital transformation to enhance customer journeys and operational efficiency.
*   Disciplined balance sheet management to optimize NIM and capital utilization.
*   Strategic expansion in high-growth segments while maintaining stringent credit underwriting standards.
*   Continued focus on talent development and fostering an agile organizational culture.

*This summary is generated based on Q3 2024 financial data and strategic objectives.*`

  const [content, setContent] = useState(defaultExecutiveContent)

  // Helper to calculate word count
  const calculateWordCount = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length
  }

  // Helper to simulate readability score (placeholder)
  const simulateReadabilityScore = () => {
    const score = Math.floor(Math.random() * (80 - 40 + 1)) + 40 // Random score between 40-80
    if (score >= 60) return `${score} (Easy)`
    if (score >= 40) return `${score} (Standard)`
    return `${score} (Challenging)`
  }

  const generatedWordCount = useMemo(() => calculateWordCount(content), [content])
  const generatedReadabilityScore = useMemo(() => simulateReadabilityScore(), [content])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, or text file.")
      return
    }

    setUploadedFile(file)
    setIsAnalyzing(true)

    // Simulate file analysis
    setTimeout(() => {
      const mockAnalysis = `Analysis of "${file.name}":
      
  **Document Structure Detected:**
  - Executive Summary format with bullet points
  - Financial highlights section with key metrics
  - Risk assessment and outlook sections
  - Formal tone with technical language

  **Key Themes Identified:**
  - Focus on quarterly performance metrics
  - Emphasis on regulatory compliance
  - Strategic initiatives and market positioning
  - Stakeholder value creation

  **Recommended Adaptations:**
  - Use similar section headings and structure
  - Maintain formal analytical tone
  - Include comparable financial metrics presentation
  - Follow similar risk disclosure patterns

  The generated content will now follow this document's style and structure.`

      setAnalysisResults(mockAnalysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const generatePowerPoint = () => {
    // Simulate PowerPoint generation
    const pptContent = `PowerPoint Presentation: ${selectedQuarter} Board Deck

  Slide 1: Executive Summary
  ${content.substring(0, 200)}...

  Slide 2: Financial Highlights
  - Revenue: Performance metrics
  - Profitability: Key indicators
  - Capital: Strength measures

  Slide 3: Strategic Initiatives
  - Growth drivers
  - Operational efficiency
  - Risk management

  Slide 4: Outlook & Priorities
  - Forward-looking statements
  - Strategic focus areas
  - Key milestones

  [Additional slides would be generated based on content length and structure]`

    const blob = new Blob([pptContent], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `board-deck-${selectedQuarter.replace(" ", "-").toLowerCase()}.pptx`
    a.click()
  }

  const applyAnalystFormat = () => {
    if (!analysisResults) return

    // Generate content based on uploaded analyst report format
    let formattedContent = `**${selectedQuarter} EARNINGS ANALYSIS**
  *Following the structure and tone of uploaded analyst report*

  **EXECUTIVE SUMMARY**
  The Bank delivered solid financial performance in ${selectedQuarter}, demonstrating resilience in a challenging operating environment. Key financial metrics showed improvement across profitability and efficiency measures, while maintaining strong capital adequacy ratios.

  **FINANCIAL PERFORMANCE HIGHLIGHTS**
  • Revenue Growth: $2.85B (+8.2% YoY) - Driven by core banking operations
  • Net Profit: $890M (+12.5% YoY) - Reflecting operational efficiency gains  
  • Net Interest Margin: 3.45% (+8bps QoQ) - Benefiting from rate environment
  • Cost-to-Income Ratio: 58.2% - Improved operational leverage
  • Return on Equity: 12.8% - Strong shareholder returns

  **BUSINESS SEGMENT ANALYSIS**
  *Retail Banking:* Continued momentum with SME loan growth and digital adoption
  *Corporate Banking:* Stable performance with focus on high-quality origination
  *Treasury Operations:* Strong contribution from trading activities

  **RISK ASSESSMENT & ASSET QUALITY**
  Credit provisions increased to $125M, reflecting prudent risk management approach. NPL ratio maintained at 1.8%, indicating stable asset quality. Forward-looking provisions demonstrate proactive stance on potential economic headwinds.

  **STRATEGIC OUTLOOK**
  Management remains focused on sustainable growth through digital transformation, disciplined capital allocation, and maintaining robust risk frameworks. Key priorities include expanding market share in target segments while preserving asset quality standards.

  **REGULATORY & COMPLIANCE**
  All regulatory requirements met with comfortable buffers. Capital adequacy ratios well above minimum requirements, providing flexibility for growth initiatives.

  *This analysis incorporates insights from the uploaded analyst report format and structure.*`

    if (userPrompt) {
      formattedContent += `\n\n**SPECIFIC FOCUS AREAS** (Based on your request):\n${userPrompt}`
    }

    setContent(formattedContent)
  }

  const generateContent = () => {
    const audienceIntro = {
      "Board of Directors": "Esteemed Board Members,",
      Investors: "Dear Investors,",
      Regulators: "To Regulatory Authorities,",
      "Internal Team": "Team,",
      Analysts: "Analysts,",
    }

    const audienceOutro = {
      "Board of Directors": "We look forward to your continued guidance.",
      Investors: "We remain committed to delivering long-term shareholder value.",
      Regulators: "We are committed to full compliance and transparency.",
      "Internal Team": "Let's continue to drive excellence together.",
      Analysts: "We appreciate your insights and analysis.",
    }

    let baseContent = ""
    const toneVariations = {
      Formal: `**Quarterly Financial Performance Report - Q${selectedQuarter.split(" ")[0].replace("Q", "")} ${selectedQuarter.split(" ")[1]}**

**I. Introduction**
This report presents the financial results of the Bank for the third quarter of 2024. The institution has demonstrated a commendable performance, reflecting the efficacy of its strategic initiatives and operational resilience within the prevailing economic landscape.

**II. Financial Performance Analysis**
Total operating revenue for the quarter reached **$2.85 billion**, marking an **8.2% increase** year-over-year. This growth is primarily attributable to robust net interest income generation and diversified non-interest revenue streams. Net profit after tax amounted to **$890 million**, representing a **12.5% increase** from the corresponding period in the previous year. This enhancement in profitability underscores the Bank's commitment to efficient resource allocation and stringent cost control.

**III. Key Performance Indicators (KPIs)**
*   **Net Interest Margin (NIM):** Expanded to 3.45%, an improvement of 8 basis points quarter-over-quarter, indicative of optimized asset-liability management.
*   **Cost-to-Income Ratio:** Improved to 58.2%, signifying enhanced operational efficiency and effective overhead management.
*   **Return on Equity (ROE):** Maintained at 12.8%, reflecting a healthy return on shareholders' capital.
*   **Capital Adequacy Ratio (CAR):** Stood at 14.5%, affirming the Bank's strong capital position and capacity to absorb potential shocks.

**IV. Asset Quality and Risk Management**
Loan loss provisions increased to $125 million, a proactive measure reflecting a cautious assessment of specific credit exposures. Despite this, the Non-Performing Loan (NPL) ratio remained stable at 1.8%, demonstrating sound asset quality. The Bank continues to adhere to robust risk management frameworks to safeguard its balance sheet.

**V. Operational Efficiency**
Ongoing digital transformation initiatives have contributed to a reduction in the cost-to-income ratio, yielding operational efficiencies and improved service delivery. Investments in technology continue to streamline processes and enhance customer engagement.

**VI. Conclusion**
The Bank's performance in Q3 2024 reflects a strong foundation for future growth. Management remains focused on leveraging market opportunities, optimizing operational efficiency, and maintaining a robust risk profile to deliver sustainable value to stakeholders.

*This report is generated based on the Bank's Q3 2024 financial statements and internal analysis.*`,

      Executive: defaultExecutiveContent, // Use the detailed default content

      Analytical: `**Q3 2024 Performance Deep Dive: Drivers and Strategic Implications**

**1. Revenue Decomposition & Growth Drivers**
Total Operating Income: $2.85B (+8.2% YoY, +3.1% QoQ).
*   **Net Interest Income (NII):** Primary driver, contributing ~70% of total revenue growth. NIM expansion of 8bps QoQ to 3.45% was primarily due to:
    *   **Loan Yield Optimization:** Successful repricing of variable-rate loans and new originations at higher spreads (+15bps impact).
    *   **Funding Cost Management:** While deposit costs increased, strategic mix shift towards lower-cost CASA deposits partially mitigated impact (-7bps).
*   **Non-Interest Income:** Resilient at $420M, despite a 5.6% QoQ decline in card interchange fees due to regulatory headwinds. This was offset by strong FX trading gains (+9.1% QoQ) and stable wealth management fees.

**2. Expense Analysis & Efficiency Gains**
Total Operating Expenses: $1.54B (+3.2% QoQ).
*   **Cost-to-Income Ratio:** Improved to 58.2% (from 59.8% in Q2), indicating enhanced operational leverage.
*   **Key Cost Drivers:**
    *   **Personnel Costs:** Increased by 2.6% QoQ due to annual increments and strategic hires in digital and analytics.
    *   **General & Administrative:** Decreased by 3.8% QoQ, reflecting successful cost optimization initiatives (e.g., reduced travel, vendor renegotiations).
    *   **Technology Investment:** Continued investment in cloud infrastructure and AI capabilities, with associated depreciation/amortization.

**3. Profitability & Capital Adequacy**
*   **Net Profit:** $890M (+12.5% YoY). The strong top-line growth combined with disciplined cost management drove this significant bottom-line expansion.
*   **Return on Assets (ROA):** 1.28%, reflecting efficient asset utilization.
*   **Return on Equity (ROE):** 12.8%, demonstrating strong returns for shareholders.
*   **Common Equity Tier 1 (CET1) Ratio:** 12.1%, comfortably above regulatory minimums, providing ample capacity for future growth and risk absorption.

**4. Asset Quality & Provisioning**
Loan Loss Provisions: Increased by 27.6% QoQ to $125M.
*   **Primary Drivers:** Proactive provisioning for potential risks in the commercial real estate portfolio and a general economic outlook adjustment.
*   **Non-Performing Loan (NPL) Ratio:** Stable at 1.8%, indicating that the increase in provisions is largely forward-looking and not a reflection of immediate asset deterioration.

**5. Strategic Implications & Forward View**
The Q3 results underscore the effectiveness of our diversified business model and focus on core banking profitability. The Bank is well-positioned to navigate potential macroeconomic headwinds, supported by strong capital and liquidity. Future focus will remain on leveraging digital channels for customer acquisition, optimizing the balance sheet for yield enhancement, and maintaining rigorous credit underwriting standards.

*This analytical summary is derived from detailed Q3 2024 financial data and internal strategic assessments.*`,
    }

    baseContent = toneVariations[selectedTone as keyof typeof toneVariations]

    // Simulate incorporating user prompt and key metrics
    let dynamicContent = `${audienceIntro[selectedAudience as keyof typeof audienceIntro]}\n\n`
    dynamicContent += userPrompt ? `*User's specific request: "${userPrompt}"*\n\n` : ""
    dynamicContent += baseContent

    if (selectedKeyMetrics.size > 0) {
      dynamicContent += "\n\n**Key Metrics Emphasized:**\n"
      Array.from(selectedKeyMetrics).forEach((metricId) => {
        const metric = financialRatios.find((r) => r.id === metricId)
        if (metric) {
          const latestValue = metric.historicalData[0]?.value
          dynamicContent += `*   **${metric.name}**: ${latestValue !== undefined ? `${latestValue}${metric.unit}` : "N/A"}\n`
        }
      })
    }

    dynamicContent += `\n\n${audienceOutro[selectedAudience as keyof typeof audienceOutro]}`

    // Simulate target word count by truncating or expanding (very basic)
    const currentWordCount = calculateWordCount(dynamicContent)
    const target = typeof targetWordCount === "number" ? targetWordCount : Number.parseInt(targetWordCount)
    if (!isNaN(target) && target > 0 && currentWordCount > target) {
      // Simple truncation
      const words = dynamicContent.split(/\s+/)
      dynamicContent = words.slice(0, target).join(" ") + "..."
    } else if (!isNaN(target) && target > 0 && currentWordCount < target) {
      // Simple expansion (just repeat a sentence)
      const filler = "\n\n*Further detailed analysis and strategic insights are available upon request.*"
      dynamicContent += filler.repeat(Math.ceil((target - currentWordCount) / calculateWordCount(filler)))
    }

    setContent(dynamicContent)
  }

  const exportToPDF = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `board-deck-${selectedQuarter.replace(" ", "-").toLowerCase()}.txt`
    a.click()
  }

  const exportToWord = () => {
    const blob = new Blob([content], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `board-deck-${selectedQuarter.replace(" ", "-").toLowerCase()}.doc`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Board Deck Drafting Assistant</h1>
              <p className="text-lg text-gray-600 leading-relaxed">Generate narrative for board presentation</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-apple-blue-300 text-apple-blue-700 hover:bg-apple-blue-50 bg-transparent px-6 py-2"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI for help
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 bg-transparent px-6 py-2"
              >
                <Link href="/">Back to Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* User Prompt Input */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                <MessageSquareText className="h-5 w-5 text-apple-blue-600" />
                <span>Content Request & Format</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Describe your requirements or upload an existing analyst report to match its format
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Input - Left Side */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Content Requirements</Label>
                  <Textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="e.g., 'Focus on our strong NIM growth and capital adequacy, and briefly mention challenges in fee income.' or 'Draft a summary for the audit committee, highlighting compliance and risk controls.'"
                    className="min-h-[120px] rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 text-gray-800 p-4"
                  />
                </div>

                {/* File Upload - Right Side */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Format Reference</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors min-h-[120px] flex flex-col justify-center">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                      <div className="text-sm text-gray-600 mb-2">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-apple-blue-600 hover:text-apple-blue-700 font-medium"
                        >
                          Upload analyst report
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PDF, Word, or text files up to 10MB</p>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {uploadedFile && (
                      <div className="mt-4 p-4 bg-apple-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-apple-blue-600" />
                          <span className="text-sm font-medium text-gray-800">{uploadedFile.name}</span>
                          <span className="text-xs text-gray-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>

                        {isAnalyzing && (
                          <div className="mt-3 text-sm text-apple-blue-600">
                            Analyzing document structure and format...
                          </div>
                        )}

                        {analysisResults && (
                          <div className="mt-4">
                            <div className="text-xs text-gray-600 mb-2">Analysis Complete:</div>
                            <div className="text-xs text-gray-700 bg-white p-3 rounded border max-h-32 overflow-y-auto leading-relaxed">
                              {analysisResults.split("\n").map((line, index) => (
                                <div key={index}>{line}</div>
                              ))}
                            </div>
                            <Button
                              onClick={applyAnalystFormat}
                              size="sm"
                              className="mt-3 bg-apple-blue-600 hover:bg-apple-blue-700 text-white rounded-full px-4 py-2"
                            >
                              Apply This Format
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                <Settings2 className="h-5 w-5 text-apple-blue-600" />
                <span>Generation Settings</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                Configure the content generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Quarter</Label>
                  <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                    <SelectTrigger className="rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-md">
                      <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                      <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                      <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                      <SelectItem value="Q4 2023">Q4 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Tone</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-md">
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Analytical">Analytical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                  <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                    <SelectTrigger className="rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-md">
                      <SelectItem value="Board of Directors">Board of Directors</SelectItem>
                      <SelectItem value="Investors">Investors</SelectItem>
                      <SelectItem value="Regulators">Regulators</SelectItem>
                      <SelectItem value="Internal Team">Internal Team</SelectItem>
                      <SelectItem value="Analysts">Analysts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Key Metrics to Emphasize</Label>
                  <MetricMultiSelect
                    metrics={financialRatios}
                    selectedMetrics={selectedKeyMetrics}
                    onSelectChange={setSelectedKeyMetrics}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="target-word-count" className="text-sm font-medium text-gray-700">
                    Target Word Count
                  </Label>
                  <Input
                    id="target-word-count"
                    type="number"
                    value={targetWordCount}
                    onChange={(e) => setTargetWordCount(e.target.value)}
                    placeholder="e.g., 1000"
                    className="rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 h-11"
                  />
                </div>
                <div className="space-y-3 flex flex-col justify-end">
                  <Label className="text-sm font-medium text-gray-700 opacity-0">Actions</Label>
                  <Button
                    onClick={generateContent}
                    className="w-full flex items-center justify-center space-x-2 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 h-11 px-6"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="shadow-lg rounded-xl border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Board Presentation Content</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  AI-generated content based on {selectedQuarter} financial data
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Words: <span className="font-semibold">{generatedWordCount}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Readability: <span className="font-semibold">{generatedReadabilityScore}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generatePowerPoint}
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 h-9 px-4 bg-transparent"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export PPT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPDF}
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 h-9 px-4 bg-transparent"
                  >
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToWord}
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 h-9 px-4 bg-transparent"
                  >
                    Export Word
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([content], { type: "text/markdown" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `board-deck-${selectedQuarter.replace(" ", "-").toLowerCase()}.md`
                      a.click()
                    }}
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-apple-gray-100 h-9 px-4"
                  >
                    Export Markdown
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview Panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const htmlContent = convertMarkdownToHtml(content)
                        const printWindow = window.open("", "_blank")
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Board Deck Preview</title>
                                <style>
                                  body { 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                                    line-height: 1.7; 
                                    max-width: 800px; 
                                    margin: 0 auto; 
                                    padding: 40px 20px; 
                                    color: #374151;
                                    font-size: 0.95rem;
                                  }
                                  h1 { 
                                    color: #1f2937; 
                                    font-size: 1.5rem; 
                                    font-weight: bold; 
                                    margin: 1.5rem 0 1rem 0; 
                                    border-bottom: 2px solid #3b82f6; 
                                    padding-bottom: 0.5rem; 
                                  }
                                  h2 { 
                                    color: #374151; 
                                    font-size: 1.25rem; 
                                    font-weight: 600; 
                                    margin: 1.25rem 0 0.75rem 0; 
                                  }
                                  h3 { 
                                    color: #4b5563; 
                                    font-size: 1.1rem; 
                                    font-weight: 600; 
                                    margin: 1rem 0 0.5rem 0; 
                                  }
                                  strong { 
                                    color: #1f2937; 
                                    font-weight: 600; 
                                  }
                                  ul { 
                                    margin: 1rem 0; 
                                    padding-left: 1.5rem; 
                                    list-style-type: disc; 
                                  }
                                  li { 
                                    margin-bottom: 0.5rem; 
                                    line-height: 1.6; 
                                  }
                                  p { 
                                    margin: 1rem 0; 
                                    line-height: 1.7; 
                                  }
                                  .highlight { 
                                    background-color: #dbeafe; 
                                    color: #1e40af; 
                                    padding: 2px 6px; 
                                    border-radius: 4px; 
                                    font-weight: 600; 
                                  }
                                </style>
                              </head>
                              <body>${htmlContent}</body>
                            </html>
                          `)
                          printWindow.document.close()
                        }
                      }}
                      className="text-apple-blue-600 hover:text-apple-blue-700"
                    >
                      Full Screen Preview
                    </Button>
                  </div>
                  <div
                    className="bg-white border border-gray-200 rounded-lg p-8 max-h-[600px] overflow-y-auto"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      color: "#374151",
                    }}
                    dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
                  />
                </div>

                {/* Editor Panel */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Edit Content</h3>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[600px] rounded-lg border-gray-300 focus:ring-apple-blue-500 focus:border-apple-blue-500 text-gray-800 p-4 font-mono text-sm leading-relaxed"
                    placeholder="Edit your board presentation content here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
