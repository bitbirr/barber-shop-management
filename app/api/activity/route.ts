import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  ACTIVITY_TYPES,
  ensureActivitySeed,
  toActivityDto,
  type ActivityType,
} from "@/lib/activity";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 40;

function parseType(value: string | null): ActivityType | "all" {
  if (!value || value === "all") return "all";
  if ((ACTIVITY_TYPES as readonly string[]).includes(value)) return value as ActivityType;
  return "all";
}

function parseCursor(raw: string | null): { createdAt: Date; id: string } | null {
  if (!raw) return null;
  const separator = raw.lastIndexOf("_");
  if (separator <= 0) return null;
  const createdAt = new Date(raw.slice(0, separator));
  const id = raw.slice(separator + 1);
  if (Number.isNaN(createdAt.getTime()) || !id) return null;
  return { createdAt, id };
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function GET(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;

  const { searchParams } = new URL(request.url);
  const type = parseType(searchParams.get("type"));
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") || DEFAULT_LIMIT) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const cursor = parseCursor(searchParams.get("cursor"));
  const organizationId = session.session.activeOrganizationId ?? null;

  try {
    const memberUserIds =
      organizationId == null
        ? []
        : (
            await prisma.member.findMany({
              where: { organizationId },
              select: { userId: true },
            })
          ).map((member) => member.userId);

    const actors =
      memberUserIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: memberUserIds } },
            select: { id: true, name: true, image: true },
            take: 12,
          })
        : await prisma.user.findMany({
            where: { id: session.user.id },
            select: { id: true, name: true, image: true },
            take: 1,
          });

    await ensureActivitySeed(
      organizationId,
      actors.map((actor) => ({
        id: actor.id,
        name: actor.name,
        image: actor.image,
      })),
    );

    const where: Prisma.ActivityWhereInput = {
      ...(organizationId ? { organizationId } : { organizationId: null }),
      ...(type === "all" ? {} : { type }),
      ...(cursor
        ? {
            OR: [
              { createdAt: { lt: cursor.createdAt } },
              { createdAt: cursor.createdAt, id: { lt: cursor.id } },
            ],
          }
        : {}),
    };

    const rows = await prisma.activity.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && page.length > 0
        ? `${page[page.length - 1].createdAt.toISOString()}_${page[page.length - 1].id}`
        : null;

    const total = await prisma.activity.count({
      where: {
        ...(organizationId ? { organizationId } : { organizationId: null }),
        ...(type === "all" ? {} : { type }),
      },
    });

    return NextResponse.json({
      activities: page.map(toActivityDto),
      nextCursor,
      hasMore,
      total,
      limit,
      type,
      organizationId,
    });
  } catch (error) {
    console.error("[api/activity] list failed", error);
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
  }
}
