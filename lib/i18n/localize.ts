import type { Locale } from "@/lib/i18n/LanguageProvider";

export function localizeField(
  locale: Locale,
  base: string,
  ru: string | null,
  en: string | null
): string {
  if (locale === "ru") return ru || base;
  if (locale === "en") return en || base;
  return base;
}
