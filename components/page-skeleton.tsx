export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="animate-pulse space-y-6 motion-reduce:animate-none">
      <span className="sr-only">Loading page content</span>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-white/[0.07]" />
          <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-white/[0.08]" />
          <div className="h-4 w-80 max-w-full rounded bg-slate-100 dark:bg-white/[0.05]" />
        </div>
        <div className="hidden h-11 w-32 rounded-xl bg-slate-200 dark:bg-white/[0.08] sm:block" />
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        {[0, 1, 2, 3].map((item) => (
          <div className="col-span-12 h-32 rounded-2xl border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#18211e] sm:col-span-6 xl:col-span-3" key={item} />
        ))}
        <div className="col-span-12 h-[360px] rounded-2xl border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#18211e] xl:col-span-8" />
        <div className="col-span-12 h-[360px] rounded-2xl border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#18211e] xl:col-span-4" />
      </div>
    </div>
  );
}
