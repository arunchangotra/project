"use client"

import type React from "react"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DataLoadingWrapperProps {
  isLoading: boolean
  error: string | null
  children: React.ReactNode
  onRetry?: () => void
}

export function DataLoadingWrapper({ isLoading, error, children, onRetry }: DataLoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading CSV Data</h3>
            <p className="text-gray-600 mb-4">Fetching and processing ADIB financial data from CSV file...</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Downloading CSV file</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                <span>Processing financial data</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                <span>Calculating variances</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Loading Error</h3>
            <p className="text-gray-600 mb-4">Failed to load CSV data from the provided source.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700 font-mono">{error}</p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
