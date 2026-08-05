import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getEventBySlug } from "@/lib/events/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Tadbir topilmadi | Sentob" };

  return {
    title: `${event.title} | Sentob Turizm Qishlog'i`,
    description: event.description.slice(0, 155),
    alternates: { canonical: `https://sentob.uz/events/${event.slug}` },
    openGraph: event.cover_image ? { images: [{ url: event.cover_image }] } : undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <nav className="text-xs text-ink-600">
            <Link href="/events" className="hover:text-forest-700">
              Tadbirlar
            </Link>
            <span className="mx-2">/</span>
            <span className="text-forest-900">{event.title}</span>
          </nav>

          {event.cover_image && (
            <div className="relative mt-6 h-72 overflow-hidden rounded-3xl sm:h-96">
              <Image src={event.cover_image} alt={event.title} fill className="object-cover" priority />
            </div>
          )}

          <h1 className="mt-8 font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-ink-600">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} className="text-forest-700" />
              {new Date(event.start_date).toLocaleDateString("uz-UZ")}
              {event.end_date && event.end_date !== event.start_date
                ? ` – ${new Date(event.end_date).toLocaleDateString("uz-UZ")}`
                : ""}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-forest-700" /> {event.location}
              </span>
            )}
          </div>

          <p className="mt-8 text-base leading-relaxed text-ink-600">{event.description}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
