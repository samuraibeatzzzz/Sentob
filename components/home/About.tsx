"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function About() {
  const { dict } = useLanguage();

  return (
    <section id="about" className="relative bg-cream-50 py-24 lg:py-32 dark:bg-forest-950">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
              {dict.about.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl lg:text-[2.6rem] dark:text-cream-50">
              {dict.about.title}
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-base leading-relaxed text-ink-600 lg:text-lg dark:text-cream-100/70">
              {dict.about.description}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-2 gap-6 border-t border-forest-900/10 pt-12 sm:grid-cols-4 dark:border-cream-50/10">
          {dict.about.stats.map((stat) => (
            <RevealItem key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-4xl font-semibold text-forest-800 sm:text-5xl dark:text-gold-400">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-ink-600 dark:text-cream-100/70">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
