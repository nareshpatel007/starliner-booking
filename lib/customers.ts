export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  country: string
  postalCode: string
  totalBookings: number
  totalSpent: number
  lastBookingDate: string
  createdAt: string
  status: "active" | "inactive"
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    postalCode: "10001",
    totalBookings: 5,
    totalSpent: 1245,
    lastBookingDate: "2025-01-15",
    createdAt: "2024-06-10T10:30:00Z",
    status: "active",
  },
  {
    id: "CUST002",
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    phone: "+1 (555) 234-5678",
    country: "United States",
    postalCode: "94102",
    totalBookings: 3,
    totalSpent: 892,
    lastBookingDate: "2025-01-18",
    createdAt: "2024-08-22T14:20:00Z",
    status: "active",
  },
  {
    id: "CUST003",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+1 (555) 345-6789",
    country: "United States",
    postalCode: "33139",
    totalBookings: 2,
    totalSpent: 556,
    lastBookingDate: "2025-01-20",
    createdAt: "2024-09-15T09:15:00Z",
    status: "active",
  },
  {
    id: "CUST004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    country: "Canada",
    postalCode: "M5H 2N2",
    totalBookings: 7,
    totalSpent: 2134,
    lastBookingDate: "2024-12-28",
    createdAt: "2024-03-05T11:45:00Z",
    status: "active",
  },
  {
    id: "CUST005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+44 20 7946 0958",
    country: "United Kingdom",
    postalCode: "SW1A 1AA",
    totalBookings: 1,
    totalSpent: 129,
    lastBookingDate: "2024-08-12",
    createdAt: "2024-08-10T16:20:00Z",
    status: "inactive",
  },
]

export function getCustomers(): Customer[] {
  return mockCustomers
}

export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getCustomersByStatus(status: "active" | "inactive"): Customer[] {
  return mockCustomers.filter((c) => c.status === status)
}
