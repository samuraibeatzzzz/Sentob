import Image from "next/image";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function getAllMedia() {
  const supabase = createSupabaseAdminClient();

  const [gallery, guestHouses, events, posts] = await Promise.all([
    supabase.from("gallery_items").select("url, title"),
    supabase.from("guest_houses").select("name, cover_image, images"),
    supabase.from("events").select("title, cover_image"),
    supabase.from("blog_posts").select("title, cover_image"),
  ]);

  const items: { url: string; label: string; source: string }[] = [];

  (gallery.data ?? []).forEach((g) => items.push({ url: g.url, label: g.title || "Gallery", source: "Gallery" }));
  (guestHouses.data ?? []).forEach((h) => {
    (h.images?.length ? h.images : h.cover_image ? [h.cover_image] : []).forEach((url: string) =>
      items.push({ url, label: h.name, source: "Guest House" })
    );
  });
  (events.data ?? []).forEach((e) => {
    if (e.cover_image) items.push({ url: e.cover_image, label: e.title, source: "Event" });
  });
  (posts.data ?? []).forEach((p) => {
    if (p.cover_image) items.push({ url: p.cover_image, label: p.title, source: "Blog" });
  });

  return items;
}

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Media Manager</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-600">
        Saytda ishlatilayotgan barcha rasmlar (Gallery, Guest Houses, Events, Blog) shu yerda
        to&apos;planadi. Yangi rasm qo&apos;shish uchun tegishli bo&apos;lim (masalan, Gallery yoki
        Guest House tahrirlash) sahifasidan URL kiriting. To&apos;g&apos;ridan-to&apos;g&apos;ri fayl
        yuklash (drag &amp; drop upload) Supabase Storage bucket sozlanganidan so&apos;ng
        qo&apos;shiladi.
      </p>

      {media.length === 0 ? (
        <p className="mt-10 text-ink-600">Hozircha rasmlar mavjud emas.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {media.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
              <div className="relative h-24 w-full">
                <Image src={item.url} alt={item.label} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-forest-950">{item.label}</p>
                <p className="text-[10px] text-ink-600">{item.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
