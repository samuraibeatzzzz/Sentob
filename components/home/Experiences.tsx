"use client";

import {
  Bike,
  Mountain,
  ChefHat,
  Wheat,
  Tent,
  Fish,
  Home,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const ICONS: LucideIcon[] = [Bike, Mountain, ChefHat, Wheat, Tent, Fish, Home];

export function Experiences() {
  const { dict } = useLanguage();

  return (
    <section className="bg-forest-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            {dict.experiences.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium text-cream-50 sm:text-4xl">
            {dict.experiences.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {dict.experiences.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealItem key={item.title}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-cream-50/10 bg-cream-50/[0.04] p-6 transition-colors duration-300 hover:bg-cream-50/[0.08]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-medium text-cream-50">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-cream-100/70">
                      {item.text}
                    </p>
                    <button className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold-400 transition-colors group-hover:text-gold-300">
                      {dict.experiences.book} →
                    </button>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
