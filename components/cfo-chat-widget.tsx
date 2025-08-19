"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Minimize2, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChatInterface } from "./chat-interface"
import { cn } from "@/lib/utils"

interface CFOChatWidgetProps {
  className?: string
}

export function CFOChatWidget({ className }: CFOChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        setIsMaximized(false)
        setIsMinimized(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setIsMaximized(false)
    setIsMinimized(false)
  }

  const handleMaximize = () => {
    setIsMaximized(true)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsMaximized(false)
  }

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="h-full flex flex-col">
          {/* Single Header for Maximized Mode */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-apple-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Earnings Assistant</h2>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">BETA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">1 conversations</span>
              <Button variant="ghost" size="sm" onClick={handleMinimize} className="h-8 w-8 p-0 hover:bg-gray-100">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <div className="max-w-4xl mx-auto h-full">
              <ChatInterface isMaximized={true} onClose={handleClose} onMinimize={handleMinimize} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className="w-96 h-[600px] shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-apple-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">AI Earnings Assistant</h3>
            <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">BETA</span>
          </div>
          <div className="flex items-center space-x-1">
            {!isMinimized && (
              <Button variant="ghost" size="sm" onClick={handleMaximize} className="h-7 w-7 p-0 hover:bg-gray-100">
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleMinimize} className="h-7 w-7 p-0 hover:bg-gray-100">
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-7 w-7 p-0 hover:bg-gray-100">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 h-[calc(100%-60px)]">
          {!isMinimized && <ChatInterface isMaximized={false} onClose={handleClose} onMinimize={handleMinimize} />}
          {isMinimized && (
            <div className="flex items-center justify-center h-full">
              <Button
                variant="ghost"
                onClick={() => setIsMinimized(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Click to expand chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
