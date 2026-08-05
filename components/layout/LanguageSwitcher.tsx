"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage, type Locale } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "uz", label: "O'Z" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Tilni tanlash"
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
          dark
            ? "border-cream-50/30 text-cream-50 hover:bg-cream-50/10"
            : "border-forest-800/20 text-forest-900 hover:bg-forest-900/5"
        )}
      >
        <Globe size={14} />
        <span>{LOCALES.find((l) => l.code === locale)?.label}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-32 overflow-hidden rounded-xl border border-forest-900/10 bg-cream-50 shadow-lg z-50 dark:bg-forest-900 dark:border-cream-50/10"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={locale === l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-forest-900/5 dark:hover:bg-cream-50/5",
                locale === l.code
                  ? "font-semibold text-forest-800 bg-forest-900/[0.04] dark:text-cream-50 dark:bg-cream-50/[0.06]"
                  : "text-ink-600 dark:text-cream-100/70"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
