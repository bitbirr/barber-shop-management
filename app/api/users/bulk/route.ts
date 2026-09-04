import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  normalizePlatformRole,
  PLATFORM_ROLE_OPTIONS,
  type PlatformRole,
} from "@/lib/auth-permissions";

function isPlatformRole(value: string): value is PlatformRole {
  return PLATFORM_ROLE_OPTIONS.some((option) => option.value === value);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const actorRole = normalizePlatformRole(session.user.role as string | undefined);
  if (actorRole !== "admin" && actorRole !== "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    userIds?: string[];
    action?: "activate" | "deactivate" | "set-role" | "remove";
    role?: string;
  };

  const userIds = Array.isArray(body.userIds) ? body.userIds.filter(Boolean) : [];
  if (userIds.length === 0 || !body.action) {
    return NextResponse.json({ error: "userIds and action are required" }, { status: 400 });
  }

  if (userIds.includes(session.user.id) && (body.action === "deactivate" || body.action === "remove")) {
    return NextResponse.json({ error: "You cannot deactivate or remove yourself" }, { status: 400 });
  }

  if (body.action === "set-role" && actorRole !== "admin") {
    return NextResponse.json({ error: "Only admins can change roles" }, { status: 403 });
  }

  if (body.action === "remove" && actorRole !== "admin") {
    return NextResponse.json({ error: "Only admins can remove users" }, { status: 403 });
  }

  const results: Array<{ userId: string; ok: boolean; error?: string }> = [];

  for (const userId of userIds) {
    try {
      if (body.action === "activate") {
        await auth.api.unbanUser({ headers: await headers(), body: { userId } });
      } else if (body.action === "deactivate") {
        await auth.api.banUser({
          headers: await headers(),
          body: { userId, banReason: "Deactivated by admin" },
        });
      } else if (body.action === "set-role") {
        const role = body.role?.trim().toLowerCase() ?? "";
        if (!isPlatformRole(role)) {
          results.push({ userId, ok: false, error: "Invalid role" });
          continue;
        }
        await auth.api.setRole({ headers: await headers(), body: { userId, role } });
      } else if (body.action === "remove") {
        await auth.api.removeUser({ headers: await headers(), body: { userId } });
      }
      results.push({ userId, ok: true });
    } catch (error) {
      results.push({
        userId,
        ok: false,
        error: error instanceof Error ? error.message : "Action failed",
      });
    }
  }

  return NextResponse.json({ results });
}
