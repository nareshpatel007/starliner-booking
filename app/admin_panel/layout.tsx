"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, Users, MapPin, Settings, Menu, X, LogOut, BarChart3 } from "lucide-react"
import { useState } from "react"
import { AuthGuard } from "@/components/admin/auth-guard"
import { logout } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/admin_panel", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin_panel/bookings", icon: Calendar },
  { name: "Customers", href: "/admin_panel/customers", icon: Users },
  { name: "Tours", href: "/admin_panel/tours", icon: MapPin },
  { name: "Reports", href: "/admin_panel/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin_panel/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin_panel/login")
    router.refresh()
  }

  if (pathname === "/admin_panel/login") {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-muted/30">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-secondary/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border shadow-soft-lg transition-smooth lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <Link href="/admin_panel" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  A
                </div>
                <span className="text-lg font-bold text-foreground">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-smooth"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/admin_panel" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:bg-accent hover:text-[#FFF]",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User section */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  AD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-soft lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
                View Site
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
