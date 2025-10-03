// API Configuration
export const API_BASE_URL = "https://starlinerdreamtours.com"

// Helper function to make API calls
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

    console.log("[v0] Making API request to:", url)

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log("[v0] API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] API error:", errorData)
      return { error: errorData.message || `Request failed with status ${response.status}` }
    }

    const data = await response.json()
    console.log("[v0] API success, data received")
    return { data }
  } catch (error: any) {
    console.log("[v0] Network error:", error.message)
    return { error: error.message || "Network error occurred" }
  }
}
