import { UserManagementTable } from "@/components/user-management-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
          <span className="size-1.5 rounded-full bg-sky-500" /> Team
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[30px]">
          Users
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">
          Manage platform users with Better Auth admin roles, status controls, and organization invites.
        </p>
      </div>
      <UserManagementTable />
    </div>
  );
}
