"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Mountain } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const { dict } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: { label: string; href: string }[] = [
    { label: dict.nav.home, href: "/#home" },
    { label: dict.nav.about, href: "/#about" },
    { label: dict.nav.attractions, href: "/#attractions" },
    { label: dict.nav.guestHouses, href: "/guest-houses" },
    { label: dict.nav.gallery, href: "/gallery" },
    { label: dict.nav.events, href: "/events" },
    { label: dict.nav.tour, href: "/360-tour" },
    { label: dict.nav.blog, href: "/blog" },
    { label: dict.nav.contact, href: "/#contact" },
  ];

  const isDark = !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-cream-50/95 backdrop-blur-md shadow-sm py-3 dark:bg-forest-950/95"
          : "bg-gradient-to-b from-forest-950/70 via-forest-950/30 to-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/#home" className="flex items-center gap-2.5 shrink-0">
          <Mountain
            size={26}
            strokeWidth={1.75}
            className={isDark ? "text-cream-50" : "text-forest-800 dark:text-cream-50"}
          />
          <span
            className={cn(
              "font-display text-lg font-semibold leading-tight tracking-wide",
              isDark ? "text-cream-50" : "text-forest-900 dark:text-cream-50"
            )}
          >
            SENTOB
            <span
              className={cn(
                "block text-[9px] font-sans font-medium tracking-[0.25em]",
                isDark ? "text-cream-100/70" : "text-forest-700/70 dark:text-cream-100/70"
              )}
            >
              TURIZM QISHLOG&apos;I
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold-500",
                isDark ? "text-cream-50/90" : "text-forest-900 dark:text-cream-50/90"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle dark={isDark} />
          <LanguageSwitcher dark={isDark} />
          <Button size="sm" variant="primary">
            {dict.nav.bookNow}
          </Button>
        </div>

        <button
          className={cn("lg:hidden", isDark ? "text-cream-50" : "text-forest-900 dark:text-cream-50")}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menyu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden mt-4 mx-4 rounded-2xl bg-cream-50 shadow-xl border border-forest-900/10 overflow-hidden animate-fade-up dark:bg-forest-900 dark:border-cream-50/10">
          <nav className="flex flex-col divide-y divide-forest-900/5 dark:divide-cream-50/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-sm font-medium text-forest-900 dark:text-cream-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3 px-6 py-4 bg-forest-900/[0.03] dark:bg-cream-50/[0.03]">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Button size="sm">{dict.nav.bookNow}</Button>
          </div>
        </div>
      )}
    </header>
  );
}
