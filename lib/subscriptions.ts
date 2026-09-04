import { prisma } from "@/lib/db";

export const SUBSCRIPTION_PLANS = ["starter", "pro", "enterprise"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const BILLING_CYCLES = ["monthly", "annual"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const SUBSCRIPTION_STATUSES = ["active", "paused", "canceled"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type SubscriptionDto = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  mrr: number;
  nextInvoiceAt: string;
  lastLoginAt: string | null;
  churnRisk: boolean;
  daysSinceLogin: number | null;
};

const CHURN_RISK_DAYS = 30;

const planMrr: Record<SubscriptionPlan, { monthly: number; annual: number }> = {
  starter: { monthly: 2900, annual: 2400 },
  pro: { monthly: 7900, annual: 6600 },
  enterprise: { monthly: 18900, annual: 15800 },
};

const upgradePath: Record<SubscriptionPlan, SubscriptionPlan | null> = {
  starter: "pro",
  pro: "enterprise",
  enterprise: null,
};

export function isPlan(value: string): value is SubscriptionPlan {
  return (SUBSCRIPTION_PLANS as readonly string[]).includes(value);
}

export function isStatus(value: string): value is SubscriptionStatus {
  return (SUBSCRIPTION_STATUSES as readonly string[]).includes(value);
}

export function isBillingCycle(value: string): value is BillingCycle {
  return (BILLING_CYCLES as readonly string[]).includes(value);
}

export function nextPlan(plan: SubscriptionPlan): SubscriptionPlan | null {
  return upgradePath[plan];
}

export function mrrFor(plan: SubscriptionPlan, cycle: BillingCycle) {
  return planMrr[plan][cycle];
}

export function computeChurnRisk(lastLoginAt: Date | null, now = new Date()) {
  if (!lastLoginAt) {
    return { churnRisk: true, daysSinceLogin: null as number | null };
  }
  const days = Math.floor((now.getTime() - lastLoginAt.getTime()) / 86_400_000);
  return {
    churnRisk: days > CHURN_RISK_DAYS,
    daysSinceLogin: days,
  };
}

export function toSubscriptionDto(row: {
  id: string;
  customerName: string;
  customerEmail: string | null;
  plan: string;
  billingCycle: string;
  status: string;
  mrr: number;
  nextInvoiceAt: Date;
  lastLoginAt: Date | null;
}): SubscriptionDto {
  const plan = isPlan(row.plan) ? row.plan : "starter";
  const billingCycle = isBillingCycle(row.billingCycle) ? row.billingCycle : "monthly";
  const status = isStatus(row.status) ? row.status : "active";
  const risk = computeChurnRisk(row.lastLoginAt);

  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    plan,
    billingCycle,
    status,
    mrr: row.mrr,
    nextInvoiceAt: row.nextInvoiceAt.toISOString(),
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    churnRisk: risk.churnRisk,
    daysSinceLogin: risk.daysSinceLogin,
  };
}

const seedRows: Array<{
  customerName: string;
  customerEmail: string;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  daysUntilInvoice: number;
  daysSinceLogin: number | null;
}> = [
  {
    customerName: "Bole Fade House",
    customerEmail: "ops@bolefade.et",
    plan: "enterprise",
    billingCycle: "annual",
    status: "active",
    daysUntilInvoice: 18,
    daysSinceLogin: 1,
  },
  {
    customerName: "Piassa Lineup",
    customerEmail: "hello@piassalineup.et",
    plan: "pro",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 6,
    daysSinceLogin: 2,
  },
  {
    customerName: "Merkato Kings",
    customerEmail: "team@merkatokings.et",
    plan: "pro",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 12,
    daysSinceLogin: 4,
  },
  {
    customerName: "Kazanchis Cuts",
    customerEmail: "desk@kazanchiscuts.et",
    plan: "starter",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 22,
    daysSinceLogin: 38,
  },
  {
    customerName: "CMC Groom Lab",
    customerEmail: "book@cmcgroom.et",
    plan: "starter",
    billingCycle: "annual",
    status: "paused",
    daysUntilInvoice: 40,
    daysSinceLogin: 52,
  },
  {
    customerName: "Sarbet Studio",
    customerEmail: "front@sarbetstudio.et",
    plan: "pro",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 9,
    daysSinceLogin: 5,
  },
  {
    customerName: "Bole Atlas Barbers",
    customerEmail: "owner@atlasbarbers.et",
    plan: "enterprise",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 3,
    daysSinceLogin: 0,
  },
  {
    customerName: "Mexico Square Shop",
    customerEmail: "contact@mexicofades.et",
    plan: "starter",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 15,
    daysSinceLogin: 41,
  },
  {
    customerName: "Gerji Edge",
    customerEmail: "hello@gerjiedge.et",
    plan: "pro",
    billingCycle: "annual",
    status: "canceled",
    daysUntilInvoice: 90,
    daysSinceLogin: 70,
  },
  {
    customerName: "Lideta Line",
    customerEmail: "shop@lidetaline.et",
    plan: "starter",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 27,
    daysSinceLogin: 11,
  },
  {
    customerName: "Summit Cuts",
    customerEmail: "ops@summitcuts.et",
    plan: "enterprise",
    billingCycle: "annual",
    status: "active",
    daysUntilInvoice: 55,
    daysSinceLogin: 1,
  },
  {
    customerName: "Ayat Clippers",
    customerEmail: "desk@ayatclippers.et",
    plan: "starter",
    billingCycle: "monthly",
    status: "active",
    daysUntilInvoice: 8,
    daysSinceLogin: 45,
  },
];

export async function ensureSubscriptionSeed(organizationId: string | null) {
  const where = organizationId ? { organizationId } : { organizationId: null as string | null };
  const existing = await prisma.subscription.count({ where });
  if (existing > 0) return { seeded: false, count: existing };

  const now = Date.now();
  await prisma.subscription.createMany({
    data: seedRows.map((row) => ({
      organizationId,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      plan: row.plan,
      billingCycle: row.billingCycle,
      status: row.status,
      mrr: mrrFor(row.plan, row.billingCycle),
      nextInvoiceAt: new Date(now + row.daysUntilInvoice * 86_400_000),
      lastLoginAt:
        row.daysSinceLogin === null ? null : new Date(now - row.daysSinceLogin * 86_400_000),
    })),
  });

  return { seeded: true, count: seedRows.length };
}
