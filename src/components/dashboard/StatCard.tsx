export function StatCard({ 
  label, 
  value, 
  caption,
  loading = false 
}: { 
  label: string
  value: string | number
  caption: string
  loading?: boolean
}) {
  return <article className="milk-card p-5">
    <p className="text-sm font-medium text-brand-700">{label}</p>
    <p className="mt-2 font-serif text-3xl font-bold text-brand-900">
      {loading ? <span className="h-8 w-16 animate-pulse rounded bg-stone-300 inline-block" /> : value}
    </p>
    <p className="mt-1 text-xs text-stone-500">{caption}</p>
  </article>
}
