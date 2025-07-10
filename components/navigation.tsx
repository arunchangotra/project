"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, Calculator, FileText, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Variance Analysis", href: "/variance", icon: TrendingUp },
  { name: "What-If Scenarios", href: "/scenarios", icon: Calculator },
  { name: "Board Deck", href: "/board-deck", icon: FileText },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <Link href="/landing" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
          <Building2 className="h-6 w-6 text-apple-blue-700" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">Earnings Assistant</span>
          <Badge
            variant="secondary"
            className="ml-2 text-xs px-2 py-0.5 rounded-full bg-apple-blue-100 text-apple-blue-700 border-apple-blue-200"
          >
            BETA
          </Badge>
        </Link>

        {/* Industries Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <span>Industries</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg shadow-md">
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Banking</span>
                <Badge
                  variant="default"
                  className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border-green-200"
                >
                  Active
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between w-full">
                <span>Distribution</span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border-gray-200"
                >
                  Coming Soon
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between w-full">
                <span>Retail</span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border-gray-200"
                >
                  Coming Soon
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between w-full">
                <span>FMCG</span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border-gray-200"
                >
                  Coming Soon
                </Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between w-full">
                <span>Real Estate</span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border-gray-200"
                >
                  Coming Soon
                </Badge>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex space-x-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-colors duration-200",
                isActive ? "text-apple-blue-700" : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
