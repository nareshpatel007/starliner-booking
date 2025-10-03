import { notFound } from "next/navigation"
import { Stepper } from "@/components/booking/stepper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getTourById } from "@/lib/tours"

export default function ThankYouPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tour = getTourById(params.id)
  if (!tour) return notFound()

  const ref = (searchParams.ref as string) || ""
  const dateISO = (searchParams.date as string) || ""
  const time = (searchParams.time as string) || ""
  const members = (searchParams.members as string) || ""
  const name = (searchParams.name as string) || ""
  const email = (searchParams.email as string) || ""

  const dateLabel = (() => {
    try {
      return dateISO ? new Date(dateISO).toLocaleDateString() : "—"
    } catch {
      return "—"
    }
  })()

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 md:py-12">
      <Stepper current={3} />
      <section className="flex min-h-[40vh] items-center justify-center">
        <Card className="w-full max-w-xl bg-card text-center shadow-sm">
          <CardHeader>
            <h1 className="text-pretty text-2xl font-semibold md:text-3xl">
              Thank you! Your booking request has been submitted.
            </h1>
            <p className="text-sm text-muted-foreground">
              We’ve sent a confirmation to your email and will follow up to finalize your reservation.
            </p>
          </CardHeader>
          <CardContent className="mx-auto grid max-w-md gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-medium">{ref || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tour</span>
              <span className="font-medium">{tour.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{dateLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{time || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Travelers</span>
              <span className="font-medium">{members || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Primary Contact</span>
              <span className="font-medium">{name || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email || "—"}</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
