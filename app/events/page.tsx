import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { getUpcomingEvents } from "@/lib/events/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tadbirlar va festivallar | Sentob Turizm Qishlog'i",
  description: "Sentobdagi Navro'z, Hosil bayrami va an'anaviy musiqa kechalari kabi tadbirlar kalendari.",
  alternates: { canonical: "https://sentob.uz/events" },
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            Tadbirlar
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            Festivallar va tadbirlar kalendari
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-600">
            Navro&apos;z, Hosil bayrami va boshqa mahalliy tadbirlarni kuzatib boring.
          </p>

          <div className="mt-12">
            <EventsCalendar events={events} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
