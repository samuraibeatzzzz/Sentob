import type { MetadataRoute } from "next";
import { getActiveGuestHouses } from "@/lib/guest-houses/queries";
import { getUpcomingEvents } from "@/lib/events/queries";
import { getPublishedPosts } from "@/lib/blog/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sentob.uz";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guest-houses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/360-tour`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [guestHouses, events, posts] = await Promise.all([
      getActiveGuestHouses(),
      getUpcomingEvents(),
      getPublishedPosts(),
    ]);

    dynamicRoutes = [
      ...guestHouses.map((house) => ({
        url: `${base}/guest-houses/${house.slug}`,
        lastModified: new Date(house.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...events.map((event) => ({
        url: `${base}/events/${event.slug}`,
        lastModified: new Date(event.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // Supabase not yet configured at build time — fall back to static routes only.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
