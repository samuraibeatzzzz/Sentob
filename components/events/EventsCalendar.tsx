"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { EventRow } from "@/types/database";
import { cn } from "@/lib/utils";

const WEEKDAYS: Record<string, string[]> = {
  uz: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};

const MONTHS: Record<string, string[]> = {
  uz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function EventsCalendar({ events }: { events: EventRow[] }) {
  const { locale } = useLanguage();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const eventDates = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    events.forEach((event) => {
      const start = new Date(`${event.start_date}T00:00:00`);
      const end = new Date(`${event.end_date ?? event.start_date}T00:00:00`);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = toDateKey(d);
        map.set(key, [...(map.get(key) ?? []), event]);
      }
    });
    return map;
  }, [events]);

  const firstDayOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // make Monday index 0

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const upcoming = [...events]
    .filter((e) => new Date(e.end_date ?? e.start_date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl bg-cream-100/60 p-6 ring-1 ring-forest-900/5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-medium text-forest-950">
            {MONTHS[locale][cursor.getMonth()]} {cursor.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest-800 hover:bg-forest-900/5"
              aria-label="Oldingi oy"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest-800 hover:bg-forest-900/5"
              aria-label="Keyingi oy"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-600">
          {WEEKDAYS[locale].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            const hasEvent = date && eventDates.has(toDateKey(date));
            const isToday = date && toDateKey(date) === toDateKey(new Date());
            return (
              <div
                key={i}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-sm",
                  !date && "invisible",
                  hasEvent && "bg-gold-500/20 font-semibold text-forest-900",
                  isToday && "ring-2 ring-forest-700",
                  !hasEvent && date && "text-ink-600"
                )}
              >
                {date?.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-medium text-forest-950">
          {locale === "ru" ? "Ближайшие события" : locale === "en" ? "Upcoming events" : "Yaqinlashib kelayotgan tadbirlar"}
        </h3>
        <div className="mt-5 space-y-4">
          {upcoming.length === 0 && (
            <p className="text-sm text-ink-600">
              {locale === "ru" ? "Пока нет запланированных событий." : locale === "en" ? "No upcoming events yet." : "Hozircha rejalashtirilgan tadbir yo'q."}
            </p>
          )}
          {upcoming.map((event) => {
            const title = localizeField(locale, event.title, event.title_ru, event.title_en);
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group flex gap-4 rounded-2xl bg-cream-100/60 p-4 ring-1 ring-forest-900/5 transition-shadow hover:shadow-md"
              >
                {event.cover_image && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={event.cover_image} alt={title} fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-display text-base font-medium text-forest-950 group-hover:text-forest-700">
                    {title}
                  </h4>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-600">
                    <CalendarDays size={13} />
                    {new Date(event.start_date).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale)}
                    {event.end_date &&
                      event.end_date !== event.start_date &&
                      ` – ${new Date(event.end_date).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale)}`}
                  </p>
                  {event.location && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-600">
                      <MapPin size={13} /> {event.location}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
