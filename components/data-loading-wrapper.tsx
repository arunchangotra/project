"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

interface DataLoadingWrapperProps {
  children: ReactNode
  isLoading?: boolean
  error?: string | null
  fallback?: ReactNode
}

export function DataLoadingWrapper({ children, isLoading = false, error = null, fallback }: DataLoadingWrapperProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Loading Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Financial Data</h3>
            <p className="text-gray-600">Fetching and processing CSV data...</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
