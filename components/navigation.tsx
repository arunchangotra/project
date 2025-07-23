"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { ChatSidebar } from "./chat-sidebar"

interface NavigationProps {
  onSidebarToggle: (isOpen: boolean) => void
  onSendMessage?: (message: string) => void
  onOpenChat?: () => void
}

export function Navigation({ onSidebarToggle, onSendMessage, onOpenChat }: NavigationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen)
    onSidebarToggle(isOpen)
  }

  return (
    <div className="p-4 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">My App</div>
        <Sheet open={isSidebarOpen} onOpenChange={handleSidebarToggle}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Manage your account settings and set preferences.</SheetDescription>
            </SheetHeader>
            <ChatSidebar
              isOpen={isSidebarOpen}
              onToggle={handleSidebarToggle}
              onSendMessage={onSendMessage}
              onOpenChat={onOpenChat}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
