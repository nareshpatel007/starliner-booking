"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin_panel")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass-effect shadow-soft">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="text-primary font-bold text-xl tracking-tight hover:text-primary/80 transition-smooth"
          >
            Booking Platform
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin_panel")) {
    return null
  }

  return (
    <footer className="border-t border-border/50 bg-secondary/5 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
            Terms of Service
          </Link>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
            Privacy Policy
          </Link>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
            Contact Us
          </Link>
        </nav>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Booking Platform. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPanel = pathname?.startsWith("/admin_panel")

  return <main className={isAdminPanel ? "" : "min-h-[calc(100vh-8rem)]"}>{children}</main>
}
