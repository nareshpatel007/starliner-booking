"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest } from "@/lib/api-config"
import type { Booking, BookingStatus } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      const { data } = await apiRequest<Booking[]>("/api/bookings")
      if (data) setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all tour bookings</p>
        </div>
        <Link href="/admin_panel/bookings/create">
          <Button className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <Plus className="mr-2 h-4 w-4" />
            Create Booking
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer, email, booking ID, or tour..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "confirmed", "cancelled", "completed"] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                  <th className="pb-3 pr-4">Booking ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Tour</th>
                  <th className="pb-3 pr-4">Date & Time</th>
                  <th className="pb-3 pr-4">Travelers</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-border last:border-0 hover:bg-accent/50 transition-smooth"
                    >
                      <td className="py-4 pr-4">
                        <span className="font-mono text-sm font-medium">{booking.id}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-medium text-foreground">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-medium text-foreground">{booking.tourTitle}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-medium text-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-medium">{booking.totalMembers}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge className={cn("capitalize", getStatusColor(booking.status))}>{booking.status}</Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-semibold text-foreground">${booking.totalPrice}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin_panel/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin_panel/bookings/${booking.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
