import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"

// GET all bookings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const bookings = getBookings()
    const filteredBookings = status ? bookings.filter((b) => b.status === status) : bookings

    return NextResponse.json({ success: true, data: filteredBookings })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST create new booking
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields for customer booking
    if (body.tourId && body.date && body.time && body.name && body.email) {
      const newBooking = {
        id: `BK${Date.now()}`,
        tourId: body.tourId,
        tourTitle: body.tourName || body.tourTitle,
        customerName: body.name || body.customerName,
        customerEmail: body.email || body.customerEmail,
        customerPhone: body.phone || body.customerPhone,
        date: body.date,
        time: body.time,
        adults: body.adults || 0,
        children: (body.children812 || 0) + (body.children37 || 0) || body.children || 0,
        infants: body.infants || 0,
        totalMembers: body.totalTravelers || body.totalMembers,
        postalCode: body.postalCode,
        country: body.country,
        status: body.status || "pending",
        totalPrice: body.totalPrice || 0,
        createdAt: new Date().toISOString(),
        notes: body.notes || "",
      }

      console.log("[v0] Booking created:", newBooking)

      return NextResponse.json({ success: true, data: newBooking, id: newBooking.id })
    }

    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
