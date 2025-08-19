"use client"

import type React from "react"

import { useCSVData } from "@/lib/data-hooks"
import { Loader2, AlertCircle, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DataLoadingWrapperProps {
  children: React.ReactNode
  showSummary?: boolean
}

export function DataLoadingWrapper({ children, showSummary = false }: DataLoadingWrapperProps) {
  const { isLoading, error, isLoaded } = useCSVData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-apple-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Financial Data</h3>
            <p className="text-gray-600 text-sm">Fetching and processing CSV data from the master database...</p>
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
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-apple-blue-600 hover:bg-apple-blue-700">
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 text-sm">
              Unable to load financial data. Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
