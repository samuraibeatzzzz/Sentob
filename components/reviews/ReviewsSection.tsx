"use client";

import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizeField } from "@/lib/i18n/localize";
import type { ReviewRow } from "@/types/database";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const SOURCE_LABEL: Record<ReviewRow["source"], string> = {
  google: "Google Reviews",
  tripadvisor: "Tripadvisor",
  local: "Sentob.uz",
};

const SOURCE_COLOR: Record<ReviewRow["source"], string> = {
  google: "bg-[#4285F4]/10 text-[#1a56c4]",
  tripadvisor: "bg-[#34E0A1]/15 text-[#0f7a58]",
  local: "bg-gold-500/15 text-gold-500",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? "fill-gold-500 text-gold-500" : "text-forest-900/15"}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  const { locale } = useLanguage();

  if (reviews.length === 0) return null;

  const average =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <section className="bg-cream-100 py-24 lg:py-32 dark:bg-forest-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
              {locale === "ru" ? "Отзывы" : locale === "en" ? "Reviews" : "Sharhlar"}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium text-forest-950 sm:text-4xl dark:text-cream-50">
              {locale === "ru"
                ? "Что говорят гости"
                : locale === "en"
                  ? "What guests say"
                  : "Mehmonlar fikri"}
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-cream-50 px-5 py-3 ring-1 ring-forest-900/5 dark:bg-forest-800 dark:ring-cream-50/10">
            <span className="font-display text-3xl font-semibold text-forest-800 dark:text-gold-400">
              {average.toFixed(1)}
            </span>
            <div>
              <StarRating rating={average} />
              <p className="mt-0.5 text-xs text-ink-600 dark:text-cream-100/70">
                {reviews.length} {locale === "ru" ? "отзывов" : locale === "en" ? "reviews" : "sharh"}
              </p>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {reviews.slice(0, 8).map((review) => {
            const comment = localizeField(locale, review.comment, review.comment_ru, review.comment_en);
            return (
              <RevealItem key={review.id}>
                <article className="flex h-full flex-col rounded-3xl bg-cream-50 p-6 ring-1 ring-forest-900/5 dark:bg-forest-800 dark:ring-cream-50/10">
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${SOURCE_COLOR[review.source]}`}
                  >
                    {SOURCE_LABEL[review.source]}
                  </span>
                  <div className="mt-3">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 dark:text-cream-100/70">
                    &ldquo;{comment}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-medium text-forest-950 dark:text-cream-50">{review.author_name}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
