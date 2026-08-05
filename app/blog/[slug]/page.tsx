import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPostBySlug } from "@/lib/blog/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Maqola topilmadi | Sentob" };

  const title = post.meta_title || `${post.title} | Sentob Turizm Qishlog'i`;
  const description = post.meta_description || post.excerpt || post.content.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `https://sentob.uz/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at,
    author: { "@type": "Person", name: post.author_name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-cream-50 pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <nav className="text-xs text-ink-600">
            <Link href="/blog" className="hover:text-forest-700">
              Yangiliklar
            </Link>
            <span className="mx-2">/</span>
            <span className="text-forest-900">{post.title}</span>
          </nav>

          {post.cover_image && (
            <div className="relative mt-6 h-72 overflow-hidden rounded-3xl sm:h-96">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <h1 className="mt-8 font-display text-3xl font-medium text-forest-950 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-ink-600">
            <span className="flex items-center gap-1.5">
              <User size={15} className="text-forest-700" /> {post.author_name}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-forest-700" />
                {new Date(post.published_at).toLocaleDateString("uz-UZ")}
              </span>
            )}
          </div>

          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink-600">
            {post.content}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
