"use client";

import { motion } from "framer-motion";
import { Play, Award, Leaf, Recycle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const { dict } = useLanguage();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-forest-950"
    >
      {/* Background Video */}
<video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 lg:px-8 lg:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold-400"
        >
          {dict.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl font-semibold leading-[0.95] text-cream-50 sm:text-7xl lg:text-8xl"
        >
          {dict.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 font-display text-2xl italic text-gold-400 sm:text-3xl"
        >
          {dict.hero.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
        >
          {dict.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-cream-50/25 bg-cream-50/10 px-3.5 py-2 backdrop-blur-sm">
            <Award size={16} className="text-gold-400 shrink-0" />
            <div className="leading-none">
              <p className="text-[10px] font-semibold tracking-wide text-cream-50">
                {dict.hero.badges.award}
              </p>
              <p className="mt-0.5 text-[9px] text-cream-100/70">{dict.hero.badges.awardBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cream-50/25 bg-cream-50/10 px-3.5 py-2 backdrop-blur-sm">
            <Leaf size={16} className="text-gold-400 shrink-0" />
            <p className="text-[10px] font-semibold tracking-wide text-cream-50">
              {dict.hero.badges.eco}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cream-50/25 bg-cream-50/10 px-3.5 py-2 backdrop-blur-sm">
            <Recycle size={16} className="text-gold-400 shrink-0" />
            <p className="text-[10px] font-semibold tracking-wide text-cream-50">
              {dict.hero.badges.sustainable}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Button size="lg">{dict.hero.ctaPrimary}</Button>
          <Button size="lg" variant="outline">
            <Play size={16} className="fill-current" />
            {dict.hero.ctaSecondary}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream-50/70 sm:flex"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">{dict.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
