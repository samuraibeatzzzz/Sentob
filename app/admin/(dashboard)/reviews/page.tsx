import { getAllReviewsAdmin } from "@/lib/admin/queries";
import { ReviewRowActions } from "@/components/admin/ReviewRowActions";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  google: "Google",
  tripadvisor: "Tripadvisor",
  local: "Sentob.uz",
};

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Reviews</h1>
      <p className="mt-1 text-sm text-ink-600">
        Google, Tripadvisor va mahalliy sharhlarni ko&apos;rish va boshqarish.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-5 py-3 font-medium">Muallif</th>
              <th className="px-5 py-3 font-medium">Manba</th>
              <th className="px-5 py-3 font-medium">Reyting</th>
              <th className="px-5 py-3 font-medium">Sharh</th>
              <th className="px-5 py-3 font-medium">Holat</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-600">
                  Hozircha sharhlar yo&apos;q.
                </td>
              </tr>
            )}
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-forest-900/5 last:border-0">
                <td className="px-5 py-4 font-medium text-forest-950">{review.author_name}</td>
                <td className="px-5 py-4 text-ink-600">{SOURCE_LABEL[review.source]}</td>
                <td className="px-5 py-4 text-ink-600">{review.rating} ★</td>
                <td className="max-w-xs truncate px-5 py-4 text-ink-600">{review.comment}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      review.is_published ? "bg-forest-900/[0.06] text-forest-800" : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {review.is_published ? "Chop etilgan" : "Yashirilgan"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ReviewRowActions id={review.id} isPublished={review.is_published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
