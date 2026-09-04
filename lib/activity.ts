import { prisma } from "@/lib/db";

export const ACTIVITY_TYPES = ["comment", "update", "alert"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type ActivityDetails = {
  summary?: string;
  note?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  changes?: Array<{ field: string; from?: string | null; to?: string | null }>;
  metadata?: Record<string, string | number | boolean | null>;
};

export type ActivityDto = {
  id: string;
  type: ActivityType;
  action: string;
  timestamp: string;
  actor: {
    id: string | null;
    name: string;
    image: string | null;
  };
  resource: {
    type: string | null;
    id: string | null;
    label: string | null;
    href: string | null;
  };
  details: ActivityDetails | null;
};

export type RecordActivityInput = {
  organizationId?: string | null;
  actorUserId?: string | null;
  actorName: string;
  actorImage?: string | null;
  type: ActivityType;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  resourceLabel?: string | null;
  resourceHref?: string | null;
  details?: ActivityDetails | null;
  createdAt?: Date;
};

function parseDetails(raw: string | null): ActivityDetails | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActivityDetails;
  } catch {
    return { summary: raw };
  }
}

function asType(value: string): ActivityType {
  if (value === "comment" || value === "update" || value === "alert") return value;
  return "update";
}

export function toActivityDto(row: {
  id: string;
  type: string;
  action: string;
  createdAt: Date;
  actorUserId: string | null;
  actorName: string;
  actorImage: string | null;
  resourceType: string | null;
  resourceId: string | null;
  resourceLabel: string | null;
  resourceHref: string | null;
  details: string | null;
}): ActivityDto {
  return {
    id: row.id,
    type: asType(row.type),
    action: row.action,
    timestamp: row.createdAt.toISOString(),
    actor: {
      id: row.actorUserId,
      name: row.actorName,
      image: row.actorImage,
    },
    resource: {
      type: row.resourceType,
      id: row.resourceId,
      label: row.resourceLabel,
      href: row.resourceHref,
    },
    details: parseDetails(row.details),
  };
}

export async function recordActivity(input: RecordActivityInput) {
  return prisma.activity.create({
    data: {
      organizationId: input.organizationId ?? null,
      actorUserId: input.actorUserId ?? null,
      actorName: input.actorName,
      actorImage: input.actorImage ?? null,
      type: input.type,
      action: input.action,
      resourceType: input.resourceType ?? null,
      resourceId: input.resourceId ?? null,
      resourceLabel: input.resourceLabel ?? null,
      resourceHref: input.resourceHref ?? null,
      details: input.details ? JSON.stringify(input.details) : null,
      ...(input.createdAt ? { createdAt: input.createdAt } : {}),
    },
  });
}

type SeedActor = {
  id: string | null;
  name: string;
  image: string | null;
};

const seedTemplates: Array<{
  type: ActivityType;
  action: (actor: string) => string;
  resourceType: string;
  resourceId: string;
  resourceLabel: string;
  resourceHref: string;
  details: ActivityDetails;
  minutesAgo: number;
}> = [
  {
    type: "comment",
    action: (actor) => `${actor} commented on invoice INV-1042`,
    resourceType: "invoice",
    resourceId: "INV-1042",
    resourceLabel: "INV-1042",
    resourceHref: "/invoices",
    details: {
      summary: "Follow-up note left on an overdue invoice.",
      note: "Customer asked to settle the balance before Saturday close.",
      changes: [{ field: "comment", to: "Please confirm wire receipt once posted." }],
    },
    minutesAgo: 12,
  },
  {
    type: "update",
    action: (actor) => `${actor} updated deal status to Negotiation`,
    resourceType: "deal",
    resourceId: "deal_bole_growth",
    resourceLabel: "Bole Fade · Growth plan",
    resourceHref: "/deals",
    details: {
      summary: "Pipeline stage moved forward after discovery call.",
      changes: [
        { field: "stage", from: "Qualified", to: "Negotiation" },
        { field: "amount", from: "18,400 ETB", to: "22,000 ETB" },
      ],
    },
    minutesAgo: 38,
  },
  {
    type: "alert",
    action: (actor) => `${actor} flagged chair utilization drop`,
    resourceType: "report",
    resourceId: "utilization-alert",
    resourceLabel: "Chair utilization",
    resourceHref: "/analytics",
    details: {
      summary: "Utilization fell below the 65% floor for the afternoon block.",
      metadata: { threshold: "65%", current: "58%", window: "14:00–17:00" },
    },
    minutesAgo: 55,
  },
  {
    type: "update",
    action: (actor) => `${actor} invited a teammate as Editor`,
    resourceType: "user",
    resourceId: "invite_pending",
    resourceLabel: "Team invitations",
    resourceHref: "/users",
    details: {
      summary: "Organization invitation created via Better Auth.",
      changes: [
        { field: "role", to: "editor" },
        { field: "email", to: "hana@bolefade.et" },
      ],
    },
    minutesAgo: 95,
  },
  {
    type: "comment",
    action: (actor) => `${actor} left a note on customer Piassa Lineup`,
    resourceType: "customer",
    resourceId: "cust_piassa",
    resourceLabel: "Piassa Lineup",
    resourceHref: "/customers",
    details: {
      summary: "Account health check note.",
      note: "Booked a follow-up demo for the Merkato branch rollout.",
    },
    minutesAgo: 140,
  },
  {
    type: "alert",
    action: (actor) => `${actor} completed a sensitive sign-in`,
    resourceType: "session",
    resourceId: "session_security",
    resourceLabel: "Security session",
    resourceHref: "/settings",
    details: {
      summary: "New session established with trusted proxy headers enabled.",
      ipAddress: "196.188.0.12",
      userAgent: "Chrome 131 · Windows",
      metadata: { cookieCache: true, secureCookies: true },
    },
    minutesAgo: 180,
  },
  {
    type: "update",
    action: (actor) => `${actor} marked invoice INV-1038 as Paid`,
    resourceType: "invoice",
    resourceId: "INV-1038",
    resourceLabel: "INV-1038",
    resourceHref: "/invoices",
    details: {
      summary: "Payment reconciled against Telebirr transfer.",
      changes: [
        { field: "status", from: "Open", to: "Paid" },
        { field: "amount", to: "12,600 ETB" },
      ],
    },
    minutesAgo: 260,
  },
  {
    type: "comment",
    action: (actor) => `${actor} replied in the pipeline thread`,
    resourceType: "deal",
    resourceId: "deal_merkato",
    resourceLabel: "Merkato Kings · Starter",
    resourceHref: "/pipeline",
    details: {
      summary: "Comment on forecast risk for next week.",
      note: "Need two more Saturday slots before we can commit the upsell.",
    },
    minutesAgo: 320,
  },
  {
    type: "update",
    action: (actor) => `${actor} changed customer segment to Growth`,
    resourceType: "customer",
    resourceId: "cust_bole",
    resourceLabel: "Bole Fade House",
    resourceHref: "/customers",
    details: {
      summary: "Segment updated after MRR crossed the Growth threshold.",
      changes: [{ field: "segment", from: "Starter", to: "Growth" }],
    },
    minutesAgo: 410,
  },
  {
    type: "alert",
    action: (actor) => `${actor} triggered overdue invoice alert`,
    resourceType: "invoice",
    resourceId: "INV-1021",
    resourceLabel: "INV-1021",
    resourceHref: "/invoices",
    details: {
      summary: "Invoice is 12 days past due.",
      metadata: { daysOverdue: 12, amount: "8,400 ETB" },
    },
    minutesAgo: 520,
  },
  {
    type: "update",
    action: (actor) => `${actor} exported the analytics CSV`,
    resourceType: "report",
    resourceId: "analytics-export",
    resourceLabel: "Performance analytics",
    resourceHref: "/analytics",
    details: {
      summary: "CSV export generated for the last 30 days.",
      metadata: { range: "Last 30 days", rows: 4 },
    },
    minutesAgo: 640,
  },
  {
    type: "comment",
    action: (actor) => `${actor} mentioned the team on a deal note`,
    resourceType: "deal",
    resourceId: "deal_cmc",
    resourceLabel: "CMC Groom Lab",
    resourceHref: "/deals",
    details: {
      summary: "Mentioned owners for a renewal decision.",
      note: "@owner Can we offer a 10% multi-chair discount?",
    },
    minutesAgo: 780,
  },
];

export async function ensureActivitySeed(organizationId: string | null, actors: SeedActor[]) {
  const where = organizationId
    ? { organizationId }
    : { organizationId: null as string | null };

  const existing = await prisma.activity.count({ where });
  if (existing > 0) return { seeded: false, count: existing };

  const fallbackActors: SeedActor[] = [
    { id: null, name: "Dawit Bekele", image: null },
    { id: null, name: "Hana Tesfaye", image: null },
    { id: null, name: "Yonas Haile", image: null },
  ];
  const pool = actors.length > 0 ? actors : fallbackActors;

  const now = Date.now();
  await prisma.activity.createMany({
    data: seedTemplates.map((template, index) => {
      const actor = pool[index % pool.length];
      return {
        organizationId,
        actorUserId: actor.id,
        actorName: actor.name,
        actorImage: actor.image,
        type: template.type,
        action: template.action(actor.name.split(" ")[0] ?? actor.name),
        resourceType: template.resourceType,
        resourceId: template.resourceId,
        resourceLabel: template.resourceLabel,
        resourceHref: template.resourceHref,
        details: JSON.stringify(template.details),
        createdAt: new Date(now - template.minutesAgo * 60_000),
      };
    }),
  });

  return { seeded: true, count: seedTemplates.length };
}
