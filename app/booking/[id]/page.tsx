"use client"

import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { Stepper } from "@/components/booking/stepper"
import { BookingSummary } from "@/components/booking/booking-summary"
import { ScheduleTab } from "@/components/booking/schedule-tab"
import { TravelersTab } from "@/components/booking/travelers-tab"
import { CustomerDetailsTab } from "@/components/booking/customer-details-tab"
import { PaymentTab } from "@/components/booking/payment-tab"
import { getTourById } from "@/lib/tours"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function BookingPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("schedule")
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set(["schedule"]))
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [adults, setAdults] = useState<number>(1)
  const [children812, setChildren812] = useState<number>(0)
  const [children37, setChildren37] = useState<number>(0)
  const [infants, setInfants] = useState<number>(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const tour = getTourById(params.id)
  const router = useRouter()
  const { toast } = useToast()

  if (!tour) return notFound()

  const totalTravellers = adults + children812 + children37 + infants

  const canProceedFromSchedule = !!selectedDate && !!timeSlot
  const canProceedFromTravelers = totalTravellers >= 1 && totalTravellers <= 10
  const canProceedFromCustomer =
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim().length >= 7 &&
    postalCode.trim().length > 0 &&
    country.trim().length > 0
  const canProceedFromPayment =
    cardNumber.trim().length >= 15 &&
    cardName.trim().length > 1 &&
    expiryDate.trim().length === 5 &&
    cvv.trim().length >= 3

  const handleNext = () => {
    if (activeTab === "schedule" && canProceedFromSchedule) {
      setCompletedTabs((prev) => new Set(prev).add("travelers"))
      setActiveTab("travelers")
    } else if (activeTab === "travelers" && canProceedFromTravelers) {
      setCompletedTabs((prev) => new Set(prev).add("customer"))
      setActiveTab("customer")
    } else if (activeTab === "customer" && canProceedFromCustomer) {
      setCompletedTabs((prev) => new Set(prev).add("payment"))
      setActiveTab("payment")
    } else if (activeTab === "payment" && canProceedFromPayment) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (activeTab === "travelers") setActiveTab("schedule")
    else if (activeTab === "customer") setActiveTab("travelers")
    else if (activeTab === "payment") setActiveTab("customer")
  }

  async function handleSubmit() {
    if (!selectedDate) return
    setSubmitting(true)
    const payload = {
      tourId: tour.id,
      tourName: tour.title,
      date: selectedDate.toISOString(),
      time: timeSlot,
      adults,
      children812,
      children37,
      infants,
      totalTravelers: totalTravellers,
      name,
      email,
      phone,
      postalCode,
      country,
      cardNumber,
      cardName,
      expiryDate,
      cvv,
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to submit booking")

      const params = new URLSearchParams({
        ref: data?.id || "",
        date: selectedDate.toISOString(),
        time: timeSlot,
        members: String(totalTravellers),
        name,
        email,
      })
      router.push(`/booking/${tour.id}/thank-you?${params.toString()}`)
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Please try again.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrentStep = (): 1 | 2 | 3 | 4 | 5 => {
    if (activeTab === "schedule") return 1
    if (activeTab === "travelers") return 2
    if (activeTab === "customer") return 3
    if (activeTab === "payment") return 4
    return 5
  }

  const canProceed =
    (activeTab === "schedule" && canProceedFromSchedule) ||
    (activeTab === "travelers" && canProceedFromTravelers) ||
    (activeTab === "customer" && canProceedFromCustomer) ||
    (activeTab === "payment" && canProceedFromPayment)

  const isTabUnlocked = (tab: string) => {
    return completedTabs.has(tab)
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-10">
      <Stepper current={getCurrentStep()} />
      <header className="space-y-2">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Complete Your Booking</h1>
        <p className="text-muted-foreground">Follow the steps to reserve your tour.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Step Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="schedule">
              <ScheduleTab
                tour={tour}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                timeSlot={timeSlot}
                setTimeSlot={setTimeSlot}
                monthOffset={monthOffset}
                setMonthOffset={setMonthOffset}
              />
            </TabsContent>

            <TabsContent value="travelers">
              <TravelersTab
                adults={adults}
                setAdults={setAdults}
                children812={children812}
                setChildren812={setChildren812}
                children37={children37}
                setChildren37={setChildren37}
                infants={infants}
                setInfants={setInfants}
              />
            </TabsContent>

            <TabsContent value="customer">
              <CustomerDetailsTab
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                country={country}
                setCountry={setCountry}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentTab
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                cvv={cvv}
                setCvv={setCvv}
              />
            </TabsContent>
          </Tabs>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={activeTab === "schedule"}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed || submitting}>
              {activeTab === "payment" ? (submitting ? "Submitting..." : "Confirm & Pay") : "Next"}
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="lg:col-span-1">
          <BookingSummary
            tour={tour}
            selectedDate={selectedDate}
            timeSlot={timeSlot}
            adults={adults}
            children812={children812}
            children37={children37}
            infants={infants}
            name={name}
            email={email}
            phone={phone}
            postalCode={postalCode}
            country={country}
          />
        </aside>
      </section>
    </main>
  )
}
