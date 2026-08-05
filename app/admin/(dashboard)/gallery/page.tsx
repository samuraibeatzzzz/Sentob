import Image from "next/image";
import { getAllGalleryItemsAdmin } from "@/lib/admin/queries";
import { AddGalleryItemForm } from "@/components/admin/AddGalleryItemForm";
import { GalleryItemActions } from "@/components/admin/GalleryItemActions";
import { cn } from "@/lib/utils";

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItemsAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Gallery</h1>
      <p className="mt-1 text-sm text-ink-600">Saytdagi galereya rasmlarini boshqarish.</p>

      <div className="mt-6">
        <AddGalleryItemForm />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
            <div className="relative h-32 w-full">
              <Image src={item.url} alt={item.title ?? ""} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-3">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  item.is_published ? "bg-forest-900/[0.06] text-forest-800" : "bg-amber-50 text-amber-700"
                )}
              >
                {item.category}
              </span>
              <GalleryItemActions id={item.id} isPublished={item.is_published} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
