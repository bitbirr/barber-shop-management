import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generateApiKeyPlaintext, hashApiKey, toApiKeyPublic } from "@/lib/api-keys";
import { auth } from "@/lib/auth";
import { normalizePlatformRole } from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

async function requireEditorSession() {
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

export async function POST(_request: Request, context: RouteContext) {
  const authResult = await requireEditorSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;
  const { id } = await context.params;
  const organizationId = session.session.activeOrganizationId ?? null;

  try {
    const existing = await prisma.apiKey.findFirst({
      where: {
        id,
        ...(organizationId
          ? { organizationId }
          : { OR: [{ createdById: session.user.id }, { organizationId: null }] }),
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    const plaintext = generateApiKeyPlaintext();
    const updated = await prisma.apiKey.update({
      where: { id: existing.id },
      data: {
        keyPrefix: plaintext.slice(0, 8),
        keyHash: hashApiKey(plaintext),
        lastFour: plaintext.slice(-4),
      },
    });

    try {
      const { recordActivity } = await import("@/lib/activity");
      await recordActivity({
        organizationId,
        actorUserId: session.user.id,
        actorName: session.user.name || session.user.email,
        actorImage: session.user.image,
        type: "alert",
        action: `${session.user.name?.split(" ")[0] || "User"} regenerated an API key`,
        resourceType: "apiKey",
        resourceId: updated.id,
        resourceLabel: updated.name,
        resourceHref: "/settings#api-keys",
        details: {
          summary: "API key secret rotated. Previous secret is revoked.",
          metadata: { keyPrefix: updated.keyPrefix },
        },
      });
    } catch (activityError) {
      console.error("[api/settings/api-keys/[id]] activity log failed", activityError);
    }

    return NextResponse.json({
      key: toApiKeyPublic(updated),
      plaintext,
      message: "Key regenerated. Copy it now — the previous secret is revoked.",
    });
  } catch (error) {
    console.error("[api/settings/api-keys/[id]] regenerate failed", error);
    return NextResponse.json({ error: "Failed to regenerate API key" }, { status: 500 });
  }
}
