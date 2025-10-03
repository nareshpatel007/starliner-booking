import { getCustomerById } from "@/lib/customers"
import { getBookings } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomerById(params.id)

  if (!customer) {
    notFound()
  }

  // Get customer's bookings
  const allBookings = getBookings()
  const customerBookings = allBookings.filter((b) => b.customerEmail === customer.email)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin_panel/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Information</CardTitle>
                <Badge
                  className={cn(
                    "capitalize",
                    customer.status === "active"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                  )}
                >
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href={`mailto:${customer.email}`} className="text-foreground hover:text-primary transition-smooth">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href={`tel:${customer.phone}`} className="text-foreground hover:text-primary transition-smooth">
                  {customer.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-foreground">
                  {customer.postalCode}, {customer.country}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Booking History */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Booking History ({customerBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {customerBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {customerBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin_panel/bookings/${booking.id}`}
                      className="block rounded-lg border border-border p-4 hover:bg-accent/50 transition-smooth"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{booking.tourTitle}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                          <p className="text-sm text-muted-foreground">{booking.totalMembers} travelers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${booking.totalPrice}</p>
                          <Badge
                            className={cn(
                              "mt-1 capitalize",
                              booking.status === "confirmed"
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : booking.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                  : "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                            )}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                </div>
                <span className="text-lg font-bold text-foreground">{customer.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                </div>
                <span className="text-lg font-bold text-primary">${customer.totalSpent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg per Booking</span>
                <span className="text-lg font-bold text-foreground">
                  ${customer.totalBookings > 0 ? Math.round(customer.totalSpent / customer.totalBookings) : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer Since</span>
                <span className="font-medium text-foreground">{new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Booking</span>
                <span className="font-medium text-foreground">
                  {new Date(customer.lastBookingDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer ID</span>
                <span className="font-mono font-medium text-foreground">{customer.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
