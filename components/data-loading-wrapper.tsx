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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Financial Data</h3>
            <p className="text-gray-600 text-center">
              Fetching and processing CSV data from ADIB financial statements...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
