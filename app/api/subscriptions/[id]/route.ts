import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recordActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { normalizePlatformRole } from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";
import {
  isBillingCycle,
  mrrFor,
  nextPlan,
  toSubscriptionDto,
  type BillingCycle,
  type SubscriptionPlan,
} from "@/lib/subscriptions";

type RouteContext = { params: Promise<{ id: string }> };
type Action = "upgrade" | "pause" | "cancel" | "resume";

async function requireEditorSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = normalizePlatformRole(session.user.role as string | undefined);
  if (role !== "admin" && role !== "editor") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireEditorSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;
  const { id } = await context.params;
  const organizationId = session.session.activeOrganizationId ?? null;

  try {
    const body = (await request.json()) as { action?: Action };
    const action = body.action;
    if (!action || !["upgrade", "pause", "cancel", "resume"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const existing = await prisma.subscription.findFirst({
      where: {
        id,
        ...(organizationId ? { organizationId } : { organizationId: null }),
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const cycle: BillingCycle = isBillingCycle(existing.billingCycle)
      ? existing.billingCycle
      : "monthly";
    const currentPlan = existing.plan as SubscriptionPlan;

    let data: {
      plan?: string;
      status?: string;
      mrr?: number;
      nextInvoiceAt?: Date;
    } = {};

    if (action === "upgrade") {
      const upgraded = nextPlan(currentPlan);
      if (!upgraded) {
        return NextResponse.json({ error: "Already on Enterprise" }, { status: 400 });
      }
      if (existing.status === "canceled") {
        return NextResponse.json({ error: "Cannot upgrade a canceled subscription" }, { status: 400 });
      }
      data = {
        plan: upgraded,
        status: "active",
        mrr: mrrFor(upgraded, cycle),
      };
    } else if (action === "pause") {
      if (existing.status === "canceled") {
        return NextResponse.json({ error: "Cannot pause a canceled subscription" }, { status: 400 });
      }
      data = { status: "paused" };
    } else if (action === "resume") {
      if (existing.status !== "paused") {
        return NextResponse.json({ error: "Only paused subscriptions can be resumed" }, { status: 400 });
      }
      data = { status: "active" };
    } else if (action === "cancel") {
      data = { status: "canceled", mrr: 0 };
    }

    const updated = await prisma.subscription.update({
      where: { id: existing.id },
      data,
    });

    try {
      await recordActivity({
        organizationId,
        actorUserId: session.user.id,
        actorName: session.user.name || session.user.email,
        actorImage: session.user.image,
        type: action === "cancel" || action === "pause" ? "alert" : "update",
        action: `${session.user.name?.split(" ")[0] || "User"} ran ${action} on ${existing.customerName}`,
        resourceType: "subscription",
        resourceId: updated.id,
        resourceLabel: existing.customerName,
        resourceHref: "/subscriptions",
        details: {
          summary: `Subscription ${action} via Better Auth–protected API.`,
          changes: [
            ...(data.plan
              ? [{ field: "plan", from: existing.plan, to: data.plan }]
              : []),
            ...(data.status
              ? [{ field: "status", from: existing.status, to: data.status }]
              : []),
            ...(typeof data.mrr === "number"
              ? [{ field: "mrr", from: String(existing.mrr), to: String(data.mrr) }]
              : []),
          ],
        },
      });
    } catch (activityError) {
      console.error("[api/subscriptions/[id]] activity log failed", activityError);
    }

    return NextResponse.json({ subscription: toSubscriptionDto(updated) });
  } catch (error) {
    console.error("[api/subscriptions/[id]] patch failed", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
