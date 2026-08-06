"use client";

import { Mountain, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SocialIcon, type SocialPlatform } from "@/components/ui/SocialIcon";

const SOCIALS: SocialPlatform[] = ["instagram", "telegram", "youtube", "facebook"];

export function Footer() {
  const { dict } = useLanguage();

  return (
    <footer id="contact" className="bg-forest-950 pt-20 text-cream-100/80">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 border-b border-cream-50/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Mountain size={22} className="text-gold-400" strokeWidth={1.75} />
              <span className="font-display text-lg font-semibold text-cream-50">
                SENTOB
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{dict.footer.about}</p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((platform) => (
                <a
                  key={platform}
                  href="#"
                  aria-label={platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  <SocialIcon platform={platform} size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-cream-50">
              {dict.footer.links}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {dict.footer.linksList.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-gold-400">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-cream-50">
              {dict.footer.contact}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold-400" />
                <span>+998 91 330 01 31</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-gold-400" />
                <span>mirjalolamonmurodov@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" />
                <span>{dict.footer.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-cream-50">
              {dict.footer.newsletter}
            </h4>
            <p className="mt-4 text-sm leading-relaxed">{dict.footer.newsletterText}</p>
            <form
              className="mt-4 flex items-center overflow-hidden rounded-full border border-cream-50/20 bg-cream-50/5 pl-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder={dict.footer.emailPlaceholder}
                className="w-full bg-transparent py-2.5 text-sm text-cream-50 placeholder:text-cream-100/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Yuborish"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-forest-950 m-1 transition-colors hover:bg-gold-400"
              >
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Sentob Turizm Qishlog&apos;i. {dict.footer.rights}</p>
          <p>Web sayt O&apos;zbekcha, Русский va English tillarida mavjud</p>
        </div>
      </div>
    </footer>
  );
}
