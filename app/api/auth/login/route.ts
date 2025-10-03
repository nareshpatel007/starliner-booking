import { NextResponse } from "next/server"

// POST admin login
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Mock authentication - in production, verify against database
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Mock successful login
    console.log("[v0] Admin login attempt:", email)

    // In production, verify credentials and generate JWT token
    const mockToken = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        token: mockToken,
        user: {
          id: "admin_001",
          email,
          name: "Admin User",
          role: "admin",
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
