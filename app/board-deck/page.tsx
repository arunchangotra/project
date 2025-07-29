"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Edit, Sparkles } from "lucide-react" // Import Settings2 for the settings icon
import { Textarea } from "@/components/ui/textarea"
import { financialRatios } from "@/lib/financial-ratios" // Import financial ratios
import { Badge } from "@/components/ui/badge"

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("quarterly")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

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

  const templates = [
    {
      id: "quarterly",
      name: "Quarterly Results",
      description: "Comprehensive quarterly performance presentation",
      slides: 12,
    },
    {
      id: "strategic",
      name: "Strategic Update",
      description: "Strategic initiatives and progress update",
      slides: 8,
    },
    {
      id: "risk",
      name: "Risk Review",
      description: "Credit risk and asset quality assessment",
      slides: 10,
    },
    {
      id: "budget",
      name: "Budget Review",
      description: "Annual budget vs actual performance",
      slides: 15,
    },
  ]

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

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Board Deck Drafting Assistant</h1>
          <p className="text-base text-gray-600 mt-1">Generate narrative for board presentation</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Template</CardTitle>
                <CardDescription>Choose a presentation template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-apple-blue-500 bg-apple-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="secondary">{template.slides} slides</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Instructions</CardTitle>
                <CardDescription>Add specific requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Focus on digital transformation initiatives, include peer comparisons..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-4 bg-apple-blue-600 hover:bg-apple-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Deck
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Presentation Preview</CardTitle>
                    <CardDescription>AI-generated board presentation</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center space-y-4">
                      <Sparkles className="h-12 w-12 text-apple-blue-600 animate-spin mx-auto" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Generating Your Presentation</h3>
                        <p className="text-gray-600">AI is crafting your board deck...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Slide {i + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-900 mb-2">Ready to Generate</h4>
                      <p className="text-amber-800 text-sm">
                        Select a template and click "Generate Deck" to create your AI-powered board presentation.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
