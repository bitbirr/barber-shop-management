import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type BillingSnapshot = {
  plan: {
    name: string;
    price: string;
    interval: string;
    seats: number;
    status: "active" | "trialing" | "past_due";
    features: string[];
  };
  usage: Array<{
    label: string;
    value: number;
    limit: number;
    unit: string;
  }>;
  organization: {
    id: string | null;
    name: string | null;
  };
};

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

export async function GET() {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;
  const organizationId = session.session.activeOrganizationId ?? null;

  try {
    const organization = organizationId
      ? await prisma.organization.findUnique({
          where: { id: organizationId },
          select: { id: true, name: true },
        })
      : null;

    const memberCount = organizationId
      ? await prisma.member.count({ where: { organizationId } })
      : 1;

    const apiKeyCount = await prisma.apiKey.count({
      where: organizationId
        ? { organizationId }
        : { createdById: session.user.id },
    });

    const activityCount = await prisma.activity.count({
      where: organizationId ? { organizationId } : { actorUserId: session.user.id },
    });

    const seatLimit = 12;
    const snapshot: BillingSnapshot = {
      plan: {
        name: "Growth",
        price: "4,900 ETB",
        interval: "month",
        seats: seatLimit,
        status: "active",
        features: [
          "Unlimited bookings",
          "Telebirr + CBE checkout",
          "Analytics exports",
          "Priority SMS",
        ],
      },
      usage: [
        { label: "Active seats", value: memberCount, limit: seatLimit, unit: "" },
        {
          label: "API requests",
          value: Math.min(50_000, 12_000 + activityCount * 40),
          limit: 50_000,
          unit: "",
        },
        { label: "SMS credits", value: 620, limit: 1000, unit: "" },
        { label: "API keys", value: apiKeyCount, limit: 10, unit: "" },
      ],
      organization: {
        id: organization?.id ?? null,
        name: organization?.name ?? null,
      },
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("[api/settings/billing] failed", error);
    return NextResponse.json({ error: "Failed to load billing" }, { status: 500 });
  }
}
