import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedPosts } from "@/lib/blog/queries";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yangiliklar | Sentob Turizm Qishlog'i",
  description: "Sentob qishlog'i haqida so'nggi yangiliklar, maqolalar va sayohat maslahatlari.",
  alternates: { canonical: "https://sentob.uz/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest-600">
            Yangiliklar
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            Sentob blogi
          </h1>

          {posts.length === 0 ? (
            <p className="mt-14 text-ink-600">Hozircha maqolalar mavjud emas.</p>
          ) : (
            <RevealGroup className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <RevealItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-3xl bg-cream-100/60 ring-1 ring-forest-900/5 transition-shadow hover:shadow-lg"
                  >
                    {post.cover_image && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.published_at && (
                        <p className="flex items-center gap-1.5 text-xs text-ink-600">
                          <CalendarDays size={13} />
                          {new Date(post.published_at).toLocaleDateString("uz-UZ")}
                        </p>
                      )}
                      <h2 className="mt-2 font-display text-xl font-medium text-forest-950">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
