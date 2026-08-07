export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 rounded-lg bg-forest-900/10" />
      <div className="mt-2 h-4 w-72 rounded-lg bg-forest-900/[0.06]" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-cream-50 ring-1 ring-forest-900/5" />
        ))}
      </div>

      <div className="mt-6 h-64 rounded-2xl bg-cream-50 ring-1 ring-forest-900/5" />
    </div>
  );
}
