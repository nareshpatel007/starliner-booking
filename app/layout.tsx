import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SiteHeader, SiteFooter, MainWrapper } from "@/components/site-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Professional Booking Platform",
  description: "Book your perfect tour experience",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />

          <MainWrapper>{children}</MainWrapper>

          <SiteFooter />
        </Suspense>

        <Analytics />
      </body>
    </html>
  )
}
