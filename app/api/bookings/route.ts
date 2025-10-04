import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"
import { apiRequest } from "@/lib/api-config";

// GET all bookings
export async function GET(req: Request) {
    try {
        // Get query params
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        // Get bookings
        const bookings = getBookings();
        const filteredBookings = status ? bookings.filter((b) => b.status === status) : bookings;

        // Return response
        return NextResponse.json({ success: true, data: filteredBookings });
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create new booking
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();

        // Extract data
        const { tourId, date, time, singlePrice, adults, children812, children37, infants, totalTravelers, name, email, phone, address } = body;

        // Define payload data
        const newBooking = {
            tourId: tourId,
            travelDate: date,
            travelTime: time,
            adults: adults || 0,
            children812: children812 || 0,
            children37: children37 || 0,
            infants: infants || 0,
            totalTravelers,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
            totalPrice: Number(singlePrice * totalTravelers)
        }

        // Send API request
        const { data: requestData } = await apiRequest("live", "/api/bookings/create", {
            method: "POST",
            body: JSON.stringify(newBooking)
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
