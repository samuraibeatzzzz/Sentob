"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type DailyForecast = {
  date: number;
  min: number;
  max: number;
  condition: string;
  icon: string;
  precipitation: number;
};

type WeatherData = {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
    icon: string;
  };
  daily: DailyForecast[];
};

function WeatherIcon({ icon, size = 22 }: { icon: string; size?: number }) {
  if (icon.startsWith("01") || icon.startsWith("02")) return <Sun size={size} className="text-gold-500" />;
  if (icon.startsWith("09") || icon.startsWith("10") || icon.startsWith("11"))
    return <CloudRain size={size} className="text-forest-600" />;
  if (icon.startsWith("13")) return <CloudSnow size={size} className="text-forest-400" />;
  return <Cloud size={size} className="text-ink-600" />;
}

const TABS = [
  { key: "today", label: { uz: "Bugungi", ru: "Сегодня", en: "Today" } },
  { key: "3day", label: { uz: "3 kunlik", ru: "3 дня", en: "3-day" } },
  { key: "7day", label: { uz: "7 kunlik", ru: "7 дней", en: "7-day" } },
] as const;

export function WeatherWidget() {
  const { locale } = useLanguage();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("today");
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch(() => !cancelled && setError("Ob-havo ma'lumotini olishda xatolik"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const dayLabel = (ts: number) =>
    new Date(ts).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale, { weekday: "short" });

  return (
    <div className="rounded-3xl bg-cream-50 p-6 ring-1 ring-forest-900/5 dark:bg-forest-900 dark:ring-cream-50/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-medium text-forest-950 dark:text-cream-50">
          {locale === "ru" ? "Погода в Сентобе" : locale === "en" ? "Sentob Weather" : "Sentob ob-havosi"}
        </h3>
        <div className="flex rounded-full bg-forest-900/[0.05] p-1 dark:bg-cream-50/10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                tab === t.key
                  ? "bg-forest-800 text-cream-50"
                  : "text-ink-600 hover:text-forest-800 dark:text-cream-100/70"
              )}
            >
              {t.label[locale]}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex items-center justify-center py-10">
          <Loader2 size={22} className="animate-spin text-forest-600" />
        </div>
      )}

      {!loading && error && (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {locale === "ru"
            ? "Данные о погоде временно недоступны."
            : locale === "en"
              ? "Weather data is temporarily unavailable."
              : "Ob-havo ma'lumotlari hozircha mavjud emas."}
        </p>
      )}

      {!loading && data && tab === "today" && (
        <div className="mt-6 flex items-center gap-6">
          <WeatherIcon icon={data.current.icon} size={52} />
          <div>
            <p className="font-display text-4xl font-semibold text-forest-950 dark:text-cream-50">
              {data.current.temp}°C
            </p>
            <p className="mt-1 text-sm capitalize text-ink-600 dark:text-cream-100/70">
              {data.current.description}
            </p>
          </div>
          <div className="ml-auto space-y-1.5 text-xs text-ink-600 dark:text-cream-100/70">
            <p className="flex items-center gap-1.5">
              <Wind size={13} /> {data.current.windSpeed} m/s
            </p>
            <p className="flex items-center gap-1.5">
              <Droplets size={13} /> {data.current.humidity}%
            </p>
          </div>
        </div>
      )}

      {!loading && data && (tab === "3day" || tab === "7day") && (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-7">
          {data.daily.slice(0, tab === "3day" ? 3 : 7).map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1.5 rounded-2xl bg-forest-900/[0.03] p-3 dark:bg-cream-50/5">
              <span className="text-xs font-medium capitalize text-ink-600 dark:text-cream-100/70">
                {dayLabel(day.date)}
              </span>
              <WeatherIcon icon={day.icon} size={20} />
              <span className="text-xs font-semibold text-forest-950 dark:text-cream-50">
                {day.max}° / {day.min}°
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
