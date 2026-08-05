import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://sentob.uz"),
  title: "Sentob Turizm Qishlog'i | Nurota tog'larining marvaridi",
  description:
    "Sentob — UN Tourism tomonidan 2023-yilda dunyodagi eng yaxshi turizm qishloqlaridan biri deb topilgan, Navoiy viloyati Nurota tumanida joylashgan noyob tog' qishlog'i.",
  keywords: [
    "Sentob",
    "Sentob qishlog'i",
    "Nurota tog'lari",
    "Navoiy turizm",
    "O'zbekiston turizmi",
    "Aydarko'l",
    "Best Tourism Villages",
  ],
  openGraph: {
    title: "Sentob Turizm Qishlog'i | Nurota tog'larining marvaridi",
    description:
      "UN Tourism tomonidan \"Best Tourism Villages 2023\" ro'yxatiga kiritilgan Sentob turizm qishlog'i.",
    url: "https://sentob.uz",
    siteName: "Sentob",
    locale: "uz_UZ",
    type: "website",
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentob Turizm Qishlog'i",
    description: "Nurota tog'larining marvaridi",
    images: ["/images/og-cover.jpg"],
  },
  alternates: {
    canonical: "https://sentob.uz",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sentob",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          // Blocking script: applies the saved/system theme before paint to avoid a light/dark flash.
          dangerouslySetInnerHTML={{
            __html: `try {
              var stored = localStorage.getItem('sentob-theme');
              var theme = stored === 'light' || stored === 'dark'
                ? stored
                : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              if (theme === 'dark') document.documentElement.classList.add('dark');
            } catch (e) {}`,
          }}
        />
        <meta name="theme-color" content="#12291d" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fbf8f0" media="(prefers-color-scheme: light)" />
      </head>
      <body className="antialiased bg-cream-50 text-ink-900 dark:bg-forest-950 dark:text-cream-50">
        <ThemeProvider>
          <LanguageProvider>
            <ServiceWorkerRegister />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
