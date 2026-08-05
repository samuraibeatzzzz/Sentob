"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { GalleryCategory, GalleryItemRow } from "@/types/database";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: GalleryCategory | "all"; label: Record<string, string> }[] = [
  { value: "all", label: { uz: "Barchasi", ru: "Все", en: "All" } },
  { value: "nature", label: { uz: "Tabiat", ru: "Природа", en: "Nature" } },
  { value: "food", label: { uz: "Taomlar", ru: "Еда", en: "Food" } },
  { value: "culture", label: { uz: "Madaniyat", ru: "Культура", en: "Culture" } },
  { value: "mountains", label: { uz: "Tog'lar", ru: "Горы", en: "Mountains" } },
  { value: "events", label: { uz: "Tadbirlar", ru: "События", en: "Events" } },
];

export function GalleryMasonry({ items }: { items: GalleryItemRow[] }) {
  const { locale } = useLanguage();
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((item) => item.category === active)),
    [items, active]
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              active === cat.value
                ? "border-forest-800 bg-forest-800 text-cream-50"
                : "border-forest-900/15 text-forest-900 hover:bg-forest-900/5"
            )}
          >
            {cat.label[locale]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-ink-600">
          {locale === "ru" ? "Фотографий пока нет." : locale === "en" ? "No photos yet." : "Hozircha rasmlar yo'q."}
        </p>
      ) : (
        <RevealGroup className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-4" stagger={0.05}>
          {filtered.map((item, index) => {
            const title = localizeField(locale, item.title || "", item.title_ru, item.title_en);
            return (
              <RevealItem key={item.id} className="mb-3 break-inside-avoid">
                <button
                  onClick={() => openLightbox(index)}
                  className="group block w-full overflow-hidden rounded-2xl"
                >
                  <div className="relative w-full" style={{ aspectRatio: (item.width || 4) / (item.height || 5) }}>
                    <Image
                      src={item.url}
                      alt={title || "Sentob"}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Yopish"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Oldingi"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20 sm:left-8"
          >
            <ChevronLeft size={22} />
          </button>
          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={
                localizeField(locale, activeImage.title || "", activeImage.title_ru, activeImage.title_en) ||
                "Sentob"
              }
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Keyingi"
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20 sm:right-8"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
