"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { GuestHouseRow } from "@/types/database";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { buttonVariants } from "@/components/ui/Button";

export function GuestHousesPreview({ guestHouses }: { guestHouses: GuestHouseRow[] }) {
  const { dict, locale } = useLanguage();
  const numberFormat = new Intl.NumberFormat(locale === "uz" ? "uz-UZ" : locale);

  if (guestHouses.length === 0) return null;

  return (
    <section id="guest-houses" className="bg-cream-50 py-24 lg:py-32 dark:bg-forest-950">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
              {dict.guestHouses.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium text-forest-950 sm:text-4xl dark:text-cream-50">
              {dict.guestHouses.title}
            </h2>
          </div>
          <Link href="/guest-houses" className={buttonVariants({ variant: "outlineDark", size: "sm" })}>
            {dict.guestHouses.all}
          </Link>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guestHouses.map((house) => {
            const name = localizeField(locale, house.name, house.name_ru, house.name_en);
            return (
              <RevealItem key={house.id}>
                <article className="group h-full overflow-hidden rounded-3xl bg-cream-100/60 ring-1 ring-forest-900/5 transition-shadow duration-500 hover:shadow-xl dark:bg-forest-800/60 dark:ring-cream-50/10">
                  <Link href={`/guest-houses/${house.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          house.cover_image ||
                          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=900&auto=format&fit=crop"
                        }
                        alt={name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <span
                        aria-label="Saqlash"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream-50/90 text-forest-800 transition-colors hover:text-gold-500"
                      >
                        <Heart size={15} />
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-medium text-forest-950 dark:text-cream-50">
                        {name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-600 dark:text-cream-100/70">
                        <Star size={13} className="fill-gold-500 text-gold-500" />
                        <span className="font-medium text-ink-900 dark:text-cream-50">{house.rating}</span>
                        <span>({house.review_count})</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-forest-800 dark:text-gold-400">
                        {numberFormat.format(house.price_per_night)} so&apos;m{" "}
                        <span className="font-normal text-ink-600 dark:text-cream-100/70">
                          / {dict.guestHouses.perNight}
                        </span>
                      </p>
                    </div>
                  </Link>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
