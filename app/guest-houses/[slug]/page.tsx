import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, BedDouble, MapPin, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "@/components/booking/BookingForm";
import { getGuestHouseBySlug } from "@/lib/guest-houses/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guestHouse = await getGuestHouseBySlug(slug);

  if (!guestHouse) {
    return { title: "Mehmon uyi topilmadi | Sentob" };
  }

  return {
    title: `${guestHouse.name} | Sentob Turizm Qishlog'i`,
    description: guestHouse.description.slice(0, 155),
    alternates: { canonical: `https://sentob.uz/guest-houses/${guestHouse.slug}` },
    openGraph: {
      title: guestHouse.name,
      description: guestHouse.description.slice(0, 155),
      images: guestHouse.cover_image ? [{ url: guestHouse.cover_image }] : undefined,
    },
  };
}

export default async function GuestHouseDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guestHouse = await getGuestHouseBySlug(slug);

  if (!guestHouse) {
    notFound();
  }

  const images = guestHouse.images.length > 0 ? guestHouse.images : [guestHouse.cover_image].filter(
    (v): v is string => Boolean(v)
  );

  const mapSrc =
    guestHouse.latitude && guestHouse.longitude
      ? `https://maps.google.com/maps?q=${guestHouse.latitude},${guestHouse.longitude}&z=13&output=embed`
      : null;

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="text-xs text-ink-600">
            <Link href="/guest-houses" className="hover:text-forest-700">
              Mehmon uylari
            </Link>
            <span className="mx-2">/</span>
            <span className="text-forest-900">{guestHouse.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-medium text-forest-950 sm:text-4xl">
                {guestHouse.name}
              </h1>
              {guestHouse.address && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
                  <MapPin size={14} /> {guestHouse.address}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-forest-900/[0.05] px-4 py-2">
              <Star size={15} className="fill-gold-500 text-gold-500" />
              <span className="text-sm font-semibold text-forest-950">{guestHouse.rating}</span>
              <span className="text-sm text-ink-600">({guestHouse.review_count} sharh)</span>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:grid-rows-2">
              <div className="relative h-72 overflow-hidden rounded-3xl sm:col-span-2 sm:row-span-2 sm:h-full">
                <Image
                  src={images[0]}
                  alt={guestHouse.name}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {images.slice(1, 3).map((img, i) => (
                <div key={i} className="relative hidden h-full overflow-hidden rounded-3xl sm:block">
                  <Image
                    src={img}
                    alt={`${guestHouse.name} ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-6 border-b border-forest-900/10 pb-8 text-sm text-ink-600">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-forest-700" /> {guestHouse.max_guests} mehmongacha
                </span>
                <span className="flex items-center gap-2">
                  <BedDouble size={16} className="text-forest-700" /> {guestHouse.rooms} xona
                </span>
              </div>

              <p className="mt-8 text-base leading-relaxed text-ink-600">
                {guestHouse.description}
              </p>

              {guestHouse.amenities.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-xl font-medium text-forest-950">Qulayliklar</h2>
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {guestHouse.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2 text-sm text-ink-600">
                        <Check size={15} className="shrink-0 text-forest-600" /> {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mapSrc && (
                <div className="mt-10">
                  <h2 className="font-display text-xl font-medium text-forest-950">Joylashuv</h2>
                  <div className="mt-4 h-72 overflow-hidden rounded-3xl ring-1 ring-forest-900/10">
                    <iframe
                      src={mapSrc}
                      title={`${guestHouse.name} xaritada`}
                      className="h-full w-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <BookingForm
                guestHouseId={guestHouse.id}
                pricePerNight={guestHouse.price_per_night}
                maxGuests={guestHouse.max_guests}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
