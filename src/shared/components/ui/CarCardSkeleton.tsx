export function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] animate-pulse flex flex-col h-full">
      <div className="h-48 bg-slate-200 w-full" />
      <div className="p-4 flex-grow flex flex-col space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="mt-auto pt-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-10 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
