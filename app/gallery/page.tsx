import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry";
import { getGalleryItems } from "@/lib/gallery/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galereya | Sentob Turizm Qishlog'i",
  description: "Sentob qishlog'ining tabiati, madaniyati, taomlari va tadbirlaridan fotolavhalar.",
  alternates: { canonical: "https://sentob.uz/gallery" },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            Galereya
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            Sentob suratlarda
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-600">
            Tabiat, madaniyat, taomlar va tadbirlardan lavhalar to&apos;plami.
          </p>

          <div className="mt-12">
            <GalleryMasonry items={items} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
