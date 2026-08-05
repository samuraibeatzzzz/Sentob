"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const IMAGES = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=900&auto=format&fit=crop",
];

export function Attractions() {
  const { dict } = useLanguage();

  return (
    <section id="attractions" className="bg-cream-100 py-24 lg:py-32 dark:bg-forest-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            {dict.attractions.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium text-forest-950 sm:text-4xl dark:text-cream-50">
            {dict.attractions.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.attractions.items.map((item, i) => (
            <RevealItem key={item.title}>
              <article className="group h-full overflow-hidden rounded-3xl bg-cream-50 shadow-sm ring-1 ring-forest-900/5 transition-shadow duration-500 hover:shadow-xl dark:bg-forest-800 dark:ring-cream-50/10">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={IMAGES[i % IMAGES.length]}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-medium text-forest-950 dark:text-cream-50">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-cream-100/70">{item.text}</p>
                  <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 transition-colors hover:text-gold-500">
                    {dict.attractions.more}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
