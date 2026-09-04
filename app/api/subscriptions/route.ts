import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { normalizePlatformRole } from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";
import {
  ensureSubscriptionSeed,
  isPlan,
  toSubscriptionDto,
  type SubscriptionPlan,
} from "@/lib/subscriptions";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function GET(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;
  const organizationId = session.session.activeOrganizationId ?? null;

  const { searchParams } = new URL(request.url);
  const planParam = searchParams.get("plan")?.trim().toLowerCase() || "all";
  const planFilter: SubscriptionPlan | "all" =
    planParam === "all" ? "all" : isPlan(planParam) ? planParam : "all";

  try {
    await ensureSubscriptionSeed(organizationId);

    const where: Prisma.SubscriptionWhereInput = {
      ...(organizationId ? { organizationId } : { organizationId: null }),
      ...(planFilter === "all" ? {} : { plan: planFilter }),
    };

    const rows = await prisma.subscription.findMany({
      where,
      orderBy: [{ mrr: "desc" }, { customerName: "asc" }],
    });

    // Prefer live Better Auth session activity when a customer user is linked.
    const linkedIds = rows
      .map((row) => row.customerUserId)
      .filter((id): id is string => Boolean(id));

    const lastLogins =
      linkedIds.length === 0
        ? []
        : await prisma.session.groupBy({
            by: ["userId"],
            where: { userId: { in: linkedIds } },
            _max: { updatedAt: true },
          });

    const lastLoginByUser = new Map(
      lastLogins.map((row) => [row.userId, row._max.updatedAt ?? null]),
    );

    const subscriptions = rows.map((row) => {
      const liveLogin = row.customerUserId
        ? lastLoginByUser.get(row.customerUserId) ?? row.lastLoginAt
        : row.lastLoginAt;
      return toSubscriptionDto({ ...row, lastLoginAt: liveLogin });
    });

    // Keep MRR descending after live login merge (order already from DB).
    subscriptions.sort((a, b) => b.mrr - a.mrr || a.customerName.localeCompare(b.customerName));

    return NextResponse.json({
      subscriptions,
      total: subscriptions.length,
      plan: planFilter,
      sort: "mrr",
      order: "desc",
      organizationId,
      canManage: ["admin", "editor"].includes(
        normalizePlatformRole(session.user.role as string | undefined),
      ),
    });
  } catch (error) {
    console.error("[api/subscriptions] list failed", error);
    return NextResponse.json({ error: "Failed to load subscriptions" }, { status: 500 });
  }
}
