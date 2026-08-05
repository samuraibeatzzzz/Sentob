"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Users, BedDouble } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { GuestHouseRow } from "@/types/database";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function GuestHousesGrid({ guestHouses }: { guestHouses: GuestHouseRow[] }) {
  const { dict, locale } = useLanguage();
  const numberFormat = new Intl.NumberFormat(locale === "uz" ? "uz-UZ" : locale);

  if (guestHouses.length === 0) {
    return (
      <Reveal className="rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/60 p-12 text-center">
        <p className="text-ink-600">
          {locale === "ru"
            ? "Пока нет доступных гостевых домов."
            : locale === "en"
              ? "No guest houses available yet."
              : "Hozircha mehmon uylari mavjud emas."}
        </p>
      </Reveal>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {guestHouses.map((house) => {
        const name = localizeField(locale, house.name, house.name_ru, house.name_en);
        const description = localizeField(
          locale,
          house.description,
          house.description_ru,
          house.description_en
        );

        return (
          <RevealItem key={house.id}>
            <Link
              href={`/guest-houses/${house.slug}`}
              className="group block h-full overflow-hidden rounded-3xl bg-cream-100/60 ring-1 ring-forest-900/5 transition-shadow duration-500 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={house.cover_image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop"}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-medium text-forest-950">{name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">
                  {description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-ink-600">
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-gold-500 text-gold-500" />
                    <span className="font-medium text-ink-900">{house.rating}</span>
                    <span>({house.review_count})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {house.max_guests}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble size={13} /> {house.rooms}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-forest-800">
                  {numberFormat.format(house.price_per_night)} so&apos;m{" "}
                  <span className="font-normal text-ink-600">/ {dict.guestHouses.perNight}</span>
                </p>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
