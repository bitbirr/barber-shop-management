import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  ensureDefaultApiKey,
  generateApiKeyPlaintext,
  hashApiKey,
  toApiKeyPublic,
} from "@/lib/api-keys";
import { auth } from "@/lib/auth";
import { normalizePlatformRole } from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

function canManageKeys(role: string | undefined) {
  const normalized = normalizePlatformRole(role);
  return normalized === "admin" || normalized === "editor";
}

export async function GET() {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;
  const organizationId = session.session.activeOrganizationId ?? null;

  try {
    await ensureDefaultApiKey(organizationId, session.user.id);

    const keys = await prisma.apiKey.findMany({
      where: organizationId
        ? { organizationId }
        : { OR: [{ organizationId: null, createdById: session.user.id }, { organizationId: null }] },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      keys: keys.map(toApiKeyPublic),
      canManage: canManageKeys(session.user.role as string | undefined),
    });
  } catch (error) {
    console.error("[api/settings/api-keys] list failed", error);
    return NextResponse.json({ error: "Failed to load API keys" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;

  if (!canManageKeys(session.user.role as string | undefined)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string };
    const organizationId = session.session.activeOrganizationId ?? null;
    const plaintext = generateApiKeyPlaintext();
    const keyPrefix = plaintext.slice(0, 8);
    const lastFour = plaintext.slice(-4);

    const row = await prisma.apiKey.create({
      data: {
        organizationId,
        createdById: session.user.id,
        name: body.name?.trim() || "API key",
        keyPrefix,
        keyHash: hashApiKey(plaintext),
        lastFour,
      },
    });

    return NextResponse.json({
      key: toApiKeyPublic(row),
      plaintext,
      message: "Copy this key now. It will not be shown again.",
    });
  } catch (error) {
    console.error("[api/settings/api-keys] create failed", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}
