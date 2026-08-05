"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Move, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { TourSceneRow } from "@/types/database";
import { cn } from "@/lib/utils";

export function VirtualTour({ scenes }: { scenes: TourSceneRow[] }) {
  const { locale } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const dragState = useRef<{ startX: number; startOffset: number } | null>(null);

  if (scenes.length === 0) {
    return (
      <p className="text-center text-ink-600">
        {locale === "ru"
          ? "Сцены тура пока недоступны."
          : locale === "en"
            ? "Tour scenes are not available yet."
            : "Tur sahnalari hozircha mavjud emas."}
      </p>
    );
  }

  const scene = scenes[activeIndex];
  const title = localizeField(locale, scene.title, scene.title_ru, scene.title_en);

  function clampOffset(value: number) {
    return Math.max(-45, Math.min(45, value));
  }

  function onPointerDown(e: React.PointerEvent) {
    dragState.current = { startX: e.clientX, startOffset: offset };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    setOffset(clampOffset(dragState.current.startOffset + dx / 6));
  }

  function onPointerUp() {
    dragState.current = null;
  }

  function switchScene(index: number) {
    setActiveIndex(index);
    setOffset(0);
  }

  return (
    <div>
      <div
        className="relative h-[60vh] w-full cursor-grab select-none overflow-hidden rounded-3xl bg-forest-950 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-y-0 left-1/2 h-full w-[160%] -translate-x-1/2 transition-transform duration-100 ease-out"
          style={{ transform: `translateX(calc(-50% + ${offset}px))` }}
        >
          <Image
            src={scene.panorama_url}
            alt={title}
            fill
            sizes="160vw"
            className="pointer-events-none object-cover"
            priority
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent p-6">
          <p className="font-display text-lg font-medium text-cream-50">{title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-cream-100/70">
            <Move size={13} />
            {locale === "ru"
              ? "Перетащите, чтобы осмотреться"
              : locale === "en"
                ? "Drag to look around"
                : "Atrofni ko'rish uchun torting"}
          </p>
        </div>

        <button
          onClick={() => switchScene((activeIndex - 1 + scenes.length) % scenes.length)}
          aria-label="Oldingi sahna"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur-sm hover:bg-cream-50/25"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => switchScene((activeIndex + 1) % scenes.length)}
          aria-label="Keyingi sahna"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur-sm hover:bg-cream-50/25"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {scenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => switchScene(i)}
            className={cn(
              "relative h-16 w-24 overflow-hidden rounded-xl ring-2 transition-all",
              i === activeIndex ? "ring-forest-700" : "ring-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image src={s.panorama_url} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
