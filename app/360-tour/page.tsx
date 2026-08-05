import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VirtualTour } from "@/components/tour/VirtualTour";
import { getTourScenes } from "@/lib/gallery/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "360° Virtual Tour | Sentob Turizm Qishlog'i",
  description: "Sentob qishlog'ini uyingizdan chiqmasdan 360 daraja aylantirib ko'ring.",
  alternates: { canonical: "https://sentob.uz/360-tour" },
};

export default async function TourPage() {
  const scenes = await getTourScenes();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            Virtual Tour
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            Sentobni 360&deg; aylantirib ko&apos;ring
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-600">
            Sichqoncha yoki barmog&apos;ingiz bilan tortib, qishloqning turli nuqtalarini har tomonlama ko&apos;ring.
          </p>

          <div className="mt-12">
            <VirtualTour scenes={scenes} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
