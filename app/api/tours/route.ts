import { NextResponse } from "next/server"
import { getTours } from "@/lib/tours"

// GET all tours
export async function GET() {
  try {
    const tours = getTours()
    return NextResponse.json({ success: true, data: tours })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST create new tour
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, shortDescription, details, price, durationHours, image } = body

    // Validate required fields
    if (!title || !shortDescription || !details || !price || !durationHours || !image) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Mock successful creation
    const newTour = {
      id: `tour-${Date.now()}`,
      title,
      shortDescription,
      details,
      price: Number(price),
      durationHours: Number(durationHours),
      image,
    }

    console.log("[v0] Tour created:", newTour)

    return NextResponse.json({ success: true, data: newTour, message: "Tour created successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
