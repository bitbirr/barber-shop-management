import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { normalizePlatformRole, type PlatformRole } from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  banned: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
  image: string | null;
};

async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = normalizePlatformRole(session.user.role as string | undefined);
  if (role !== "admin" && role !== "editor") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function GET(request: Request) {
  const authResult = await requireAdminSession();
  if ("error" in authResult && authResult.error) return authResult.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || undefined;
  const role = searchParams.get("role")?.trim() || undefined;
  const status = searchParams.get("status")?.trim() || undefined;
  const limit = Number(searchParams.get("limit") || 100);
  const offset = Number(searchParams.get("offset") || 0);

  try {
    const listed = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit,
        offset,
        sortBy: "createdAt",
        sortDirection: "desc",
        ...(search
          ? {
              searchValue: search,
              searchField: "email",
              searchOperator: "contains",
            }
          : {}),
        ...(role && role !== "all"
          ? {
              filterField: "role",
              filterValue: role === "viewer" ? ["viewer", "user"] : role,
              filterOperator: role === "viewer" ? "in" : "eq",
            }
          : status === "active"
            ? { filterField: "banned", filterValue: false, filterOperator: "eq" }
            : status === "inactive"
              ? { filterField: "banned", filterValue: true, filterOperator: "eq" }
              : {}),
      },
    });

    const users = listed.users ?? [];
    const ids = users.map((user) => user.id);

    const sessions =
      ids.length === 0
        ? []
        : await prisma.session.groupBy({
            by: ["userId"],
            where: { userId: { in: ids } },
            _max: { updatedAt: true },
          });

    const lastLoginByUser = new Map(
      sessions.map((row) => [row.userId, row._max.updatedAt?.toISOString() ?? null]),
    );

    const managed: ManagedUser[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizePlatformRole(user.role as string | undefined),
      banned: Boolean(user.banned),
      emailVerified: Boolean(user.emailVerified),
      createdAt: new Date(user.createdAt).toISOString(),
      lastLogin: lastLoginByUser.get(user.id) ?? null,
      image: user.image ?? null,
    }));

    // When both role and status filters needed, admin API only supports one filterField —
    // apply the second filter in-memory if both were requested.
    let filtered = managed;
    if (role && role !== "all" && status && status !== "all") {
      filtered = managed.filter((user) => {
        const roleOk = user.role === role;
        const statusOk = status === "active" ? !user.banned : user.banned;
        return roleOk && statusOk;
      });
    }

    return NextResponse.json({
      users: filtered,
      total: listed.total ?? filtered.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[api/users] list failed", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
