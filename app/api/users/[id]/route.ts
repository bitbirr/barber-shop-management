import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  normalizePlatformRole,
  PLATFORM_ROLE_OPTIONS,
  type PlatformRole,
} from "@/lib/auth-permissions";

type RouteContext = { params: Promise<{ id: string }> };

function isPlatformRole(value: string): value is PlatformRole {
  return PLATFORM_ROLE_OPTIONS.some((option) => option.value === value);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const actorRole = normalizePlatformRole(session.user.role as string | undefined);
  if (actorRole !== "admin" && actorRole !== "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: userId } = await context.params;
  const body = (await request.json()) as { banned?: boolean; role?: string };

  try {
    if (typeof body.banned === "boolean") {
      if (userId === session.user.id && body.banned) {
        return NextResponse.json({ error: "You cannot deactivate yourself" }, { status: 400 });
      }
      if (body.banned) {
        await auth.api.banUser({
          headers: await headers(),
          body: { userId, banReason: "Deactivated from user management" },
        });
      } else {
        await auth.api.unbanUser({ headers: await headers(), body: { userId } });
      }
    }

    if (typeof body.role === "string") {
      if (actorRole !== "admin") {
        return NextResponse.json({ error: "Only admins can change roles" }, { status: 403 });
      }
      const role = body.role.trim().toLowerCase();
      if (!isPlatformRole(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      await auth.api.setRole({ headers: await headers(), body: { userId, role } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/users/:id] patch failed", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
