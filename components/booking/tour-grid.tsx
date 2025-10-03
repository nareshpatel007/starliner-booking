import type { Tour } from "@/lib/tours"
import { TourCard } from "./tour-card"

export function TourGrid({ tours }: { tours: Tour[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((t) => (
        <TourCard key={t.id} tour={t} />
      ))}
    </div>
  )
}
