export type TimeSlot = {
    time: string // e.g., "09:00"
    capacity: number // max bookings for this slot
}

export type TourSchedule = {
    availableDays: number[] // 0-6 (Sunday-Saturday), e.g., [1,2,3,4,5,6] excludes Sundays
    timeSlots: TimeSlot[]
    blockedDates: string[] // ISO date strings for specific blocked dates
    advanceBookingDays: number // how many days in advance can be booked (default 60)
}

export type Tour = {
    id: string
    title: string
    short_description: string
    price: number
    duration_hours: number
    image: string
    details: string
    schedule?: TourSchedule
}

const tours: Tour[] = [
    {
        id: "sunset-sail",
        title: "Sunset Sail Cruise",
        short_description: "Glide across the bay as the sun dips below the horizon.",
        price: 129,
        duration_hours: 2,
        image: "/sunset-sail-cruise.jpg",
        details:
            "Enjoy a serene two-hour sunset sail with complimentary beverages and guided commentary on local landmarks.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6], // Monday-Saturday
            timeSlots: [
                { time: "09:00", capacity: 10 },
                { time: "11:00", capacity: 10 },
                { time: "14:00", capacity: 10 },
                { time: "16:00", capacity: 10 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
    {
        id: "city-walk",
        title: "Historic City Walking Tour",
        short_description: "Discover hidden alleys, architecture, and stories of the old town.",
        price: 49,
        duration_hours: 3,
        image: "/historic-city-walking-tour.jpg",
        details: "A curated route through the city's most iconic districts, with stops for photos and local treats.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6],
            timeSlots: [
                { time: "09:00", capacity: 15 },
                { time: "11:00", capacity: 15 },
                { time: "14:00", capacity: 15 },
                { time: "16:00", capacity: 15 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
    {
        id: "mountain-hike",
        title: "Guided Mountain Hike",
        short_description: "A moderate ascent with panoramic views and expert guides.",
        price: 99,
        duration_hours: 5,
        image: "/guided-mountain-hike.jpg",
        details: "Trail-tested guides lead you up scenic paths with frequent rest points and nature insights.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6],
            timeSlots: [
                { time: "09:00", capacity: 12 },
                { time: "14:00", capacity: 12 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
    {
        id: "wine-country",
        title: "Wine Country Day Trip",
        short_description: "Taste award-winning wines and stroll through vineyards.",
        price: 159,
        duration_hours: 6,
        image: "/wine-country-vineyards.jpg",
        details: "Visit two boutique wineries, enjoy a picnic lunch, and learn about local varietals.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6],
            timeSlots: [
                { time: "09:00", capacity: 8 },
                { time: "11:00", capacity: 8 },
                { time: "14:00", capacity: 8 },
                { time: "16:00", capacity: 8 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
    {
        id: "reef-snorkel",
        title: "Coral Reef Snorkeling",
        short_description: "Explore vibrant marine life with top-quality gear included.",
        price: 139,
        duration_hours: 4,
        image: "/coral-reef-snorkeling.png",
        details: "Crystal-clear waters, guided snorkel tour, and safety briefing for all experience levels.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6],
            timeSlots: [
                { time: "09:00", capacity: 10 },
                { time: "11:00", capacity: 10 },
                { time: "14:00", capacity: 10 },
                { time: "16:00", capacity: 10 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
    {
        id: "food-tour",
        title: "Street Food Safari",
        short_description: "Savor local flavors on a chef-curated tasting trail.",
        price: 69,
        duration_hours: 2,
        image: "/street-food-tour.png",
        details: "Sample 6+ dishes from beloved vendors, with stories about the food culture and people behind it.",
        schedule: {
            availableDays: [1, 2, 3, 4, 5, 6],
            timeSlots: [
                { time: "09:00", capacity: 12 },
                { time: "11:00", capacity: 12 },
                { time: "14:00", capacity: 12 },
                { time: "16:00", capacity: 12 },
            ],
            blockedDates: [],
            advanceBookingDays: 60,
        },
    },
]

export function getTourById(id: string): Tour | undefined {
    return tours.find((t) => t.id === id)
}

export function getAvailableDatesForTour(tour: Tour): Set<string> {
    const available = new Set<string>()
    const schedule = tour.schedule

    if (!schedule) {
        // Fallback to old behavior if no schedule defined
        const now = new Date()
        for (let i = 0; i < 60; i++) {
            const d = new Date(now)
            d.setDate(now.getDate() + i)
            if (d.getDay() !== 0) {
                available.add(d.toDateString())
            }
        }
        return available
    }

    const now = new Date()
    const blockedSet = new Set(schedule.blockedDates)

    for (let i = 0; i < schedule.advanceBookingDays; i++) {
        const d = new Date(now)
        d.setDate(now.getDate() + i)

        // Check if day of week is available
        if (!schedule.availableDays.includes(d.getDay())) {
            continue
        }

        // Check if date is not blocked
        const dateStr = d.toISOString().split("T")[0]
        if (blockedSet.has(dateStr)) {
            continue
        }

        available.add(d.toDateString())
    }

    return available
}
