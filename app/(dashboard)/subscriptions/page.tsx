import { SubscriptionManagementTable } from "@/components/subscription-management-table";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
          <span className="size-1.5 rounded-full bg-sky-500" /> Billing
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-gray-100 sm:text-[30px]">
          Subscription management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
          Filter by plan, sort by MRR, and act on upgrades, pauses, or cancellations. Churn risk
          flags accounts with no login in over 30 days.
        </p>
      </div>

      <SubscriptionManagementTable />
    </div>
  );
}
