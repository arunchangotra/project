"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Minimize2, Maximize2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "./chat-interface"
import { cn } from "@/lib/utils"

interface CFOChatWidgetProps {
  isEnabled: boolean
  onClose?: () => void
}

export function CFOChatWidget({ isEnabled, onClose }: CFOChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  // Close chat when it's disabled
  useEffect(() => {
    if (!isEnabled && isOpen) {
      setIsOpen(false)
      setIsMaximized(false)
    }
  }, [isEnabled, isOpen])

  if (!isEnabled) {
    return null
  }

  const handleToggle = () => {
    if (isMaximized) {
      setIsMaximized(false)
      setIsOpen(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleMaximize = () => {
    setIsMaximized(true)
    setIsOpen(false)
  }

  const handleMinimize = () => {
    setIsMaximized(false)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMaximized(false)
    onClose?.()
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && !isMaximized && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-apple-blue-600 hover:bg-apple-blue-700 shadow-lg z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Windowed Chat */}
      {isOpen && !isMaximized && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col bg-white border-none rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-apple-blue-600" />
              <h3 className="font-semibold text-gray-900">AI Earnings Assistant</h3>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700">
                BETA
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={handleMaximize} className="h-8 w-8 p-0">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface isMaximized={false} />
          </div>
        </Card>
      )}

      {/* Maximized Chat */}
      {isMaximized && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Single Header for Maximized Mode */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-apple-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">AI Earnings Assistant</h1>
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-700">
                BETA
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">1 conversation</span>
              <Button variant="ghost" size="sm" onClick={handleMinimize} className="h-9 w-9 p-0">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-9 w-9 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface isMaximized={true} onClose={handleClose} onMinimize={handleMinimize} />
          </div>
        </div>
      )}
    </>
  )
}
