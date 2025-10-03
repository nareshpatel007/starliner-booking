import { NextResponse } from "next/server"
import { getCustomers } from "@/lib/customers"

// GET all customers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const customers = getCustomers()
    const filteredCustomers = status ? customers.filter((c) => c.status === status) : customers

    return NextResponse.json({ success: true, data: filteredCustomers })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST create new customer
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, postalCode, country } = body

    // Validate required fields
    if (!name || !email || !phone || !postalCode || !country) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Mock successful creation
    const newCustomer = {
      id: `CUST${Date.now()}`,
      name,
      email,
      phone,
      postalCode,
      country,
      totalBookings: 0,
      totalSpent: 0,
      lastBookingDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      status: "active" as const,
    }

    console.log("[v0] Customer created:", newCustomer)

    return NextResponse.json({ success: true, data: newCustomer, message: "Customer created successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
