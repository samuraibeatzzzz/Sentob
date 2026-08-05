import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GuestHousesGrid } from "@/components/guest-houses/GuestHousesGrid";
import { getActiveGuestHouses } from "@/lib/guest-houses/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mehmon uylari | Sentob Turizm Qishlog'i",
  description:
    "Sentob qishlog'idagi barcha mehmon uylari — narxlari, reytingi va qulayliklari bilan. Onlayn band qiling.",
  alternates: { canonical: "https://sentob.uz/guest-houses" },
};

export default async function GuestHousesPage() {
  const guestHouses = await getActiveGuestHouses();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            Mehmon uylari
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            Sentobdagi barcha mehmon uylari
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-600">
            Har biri mahalliy oilalar tomonidan boshqariladi. Sanani tanlang va onlayn band qiling.
          </p>

          <div className="mt-14">
            <GuestHousesGrid guestHouses={guestHouses} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
