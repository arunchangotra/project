"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useCSVData } from "@/lib/data-hooks"

interface DataLoadingWrapperProps {
  children: ReactNode
}

export function DataLoadingWrapper({ children }: DataLoadingWrapperProps) {
  const { isLoading, error, isLoaded } = useCSVData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Loading Financial Data</h3>
            <p className="text-gray-600">Fetching and processing CSV data...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Data Loading Error</h3>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">No Data Available</h3>
            <p className="text-gray-600">Unable to load financial data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
