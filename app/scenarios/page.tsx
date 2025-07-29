"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, TrendingDown, Play } from "lucide-react"
import { sampleScenarios } from "@/lib/sample-data"

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState(sampleScenarios[0])
  const [customScenario, setCustomScenario] = useState({
    loanGrowth: 8.5,
    nimExpansion: 15,
    costGrowth: 4.2,
  })

  const runScenario = () => {
    // Simulate scenario calculation
    console.log("Running scenario with:", customScenario)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">What-If Scenarios</h1>
          <p className="text-gray-600">Simulate impact of business levers on key financial metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Builder */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario Builder</CardTitle>
                <CardDescription>Adjust key parameters to model different outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanGrowth">Loan Growth (%)</Label>
                  <Input
                    id="loanGrowth"
                    type="number"
                    value={customScenario.loanGrowth}
                    onChange={(e) =>
                      setCustomScenario((prev) => ({
                        ...prev,
                        loanGrowth: Number.parseFloat(e.target.value),
                      }))
                    }
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nimExpansion">NIM Expansion (bps)</Label>
                  <Input
                    id="nimExpansion"
                    type="number"
                    value={customScenario.nimExpansion}
                    onChange={(e) =>
                      setCustomScenario((prev) => ({
                        ...prev,
                        nimExpansion: Number.parseFloat(e.target.value),
                      }))
                    }
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costGrowth">Cost Growth (%)</Label>
                  <Input
                    id="costGrowth"
                    type="number"
                    value={customScenario.costGrowth}
                    onChange={(e) =>
                      setCustomScenario((prev) => ({
                        ...prev,
                        costGrowth: Number.parseFloat(e.target.value),
                      }))
                    }
                    step="0.1"
                  />
                </div>

                <Button onClick={runScenario} className="w-full bg-apple-blue-600 hover:bg-apple-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Run Scenario
                </Button>
              </CardContent>
            </Card>

            {/* Predefined Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Predefined Scenarios</CardTitle>
                <CardDescription>Select from common scenario templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedScenario.id === scenario.id
                        ? "border-apple-blue-500 bg-apple-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge variant="outline">ROE: {scenario.results.roe}%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario Results</CardTitle>
                <CardDescription>Impact analysis for: {selectedScenario.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700">Net Income</p>
                        <p className="text-2xl font-bold text-green-900">₹{selectedScenario.results.netIncome}M</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700">Return on Equity</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedScenario.results.roe}%</p>
                      </div>
                      <Calculator className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700">Cost-to-Income Ratio</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedScenario.results.cir}%</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Key Assumptions</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Loan Growth: {selectedScenario.assumptions.loanGrowth}%</p>
                    <p>• NIM Expansion: {selectedScenario.assumptions.nimExpansion} bps</p>
                    <p>• Cost Growth: {selectedScenario.assumptions.costGrowth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
