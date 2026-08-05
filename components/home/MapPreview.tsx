"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const PIN_POSITIONS = [
  { top: "28%", left: "62%" },
  { top: "45%", left: "38%" },
  { top: "58%", left: "70%" },
  { top: "68%", left: "50%" },
];

export function MapPreview() {
  const { dict } = useLanguage();

  return (
    <section id="map" className="bg-cream-100 py-24 lg:py-32 dark:bg-forest-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
              {dict.map.title}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium text-forest-950 sm:text-4xl dark:text-cream-50">
              {dict.map.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-cream-100/70">
              {dict.map.description}
            </p>
            <Button className="mt-7">{dict.map.open}</Button>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative h-80 overflow-hidden rounded-3xl bg-forest-800 shadow-lg ring-1 ring-forest-900/10 sm:h-96">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-forest-950/25" />
              {PIN_POSITIONS.map((pos, i) => (
                <span
                  key={i}
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-md"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <MapPin size={16} className="fill-forest-950" />
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
