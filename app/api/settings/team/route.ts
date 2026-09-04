import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recordActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type SettingsTeamMember = {
  id: string;
  role: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
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
    if (organizationId) {
      const listed = await auth.api.listMembers({
        headers: await headers(),
        query: {
          organizationId,
          limit: 50,
          sortBy: "createdAt",
          sortDirection: "asc",
        },
      });

      const members: SettingsTeamMember[] = (listed.members ?? []).map((member) => ({
        id: member.id,
        role: String(member.role),
        userId: member.userId,
        createdAt: new Date(member.createdAt).toISOString(),
        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          image: member.user.image ?? null,
        },
      }));

      return NextResponse.json({
        members,
        organizationId,
        source: "better-auth",
      });
    }

    // Fallback when no active org: show the signed-in user as a solo workspace member.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ members: [], organizationId: null, source: "fallback" });
    }

    const members: SettingsTeamMember[] = [
      {
        id: `self_${user.id}`,
        role: "owner",
        userId: user.id,
        createdAt: user.createdAt.toISOString(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
    ];

    return NextResponse.json({
      members,
      organizationId: null,
      source: "fallback",
      message: "No active organization. Showing your account only.",
    });
  } catch (error) {
    console.error("[api/settings/team] list failed", error);
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authResult = await requireSession();
  if ("error" in authResult && authResult.error) return authResult.error;
  const { session } = authResult;

  try {
    const body = (await request.json()) as { memberId?: string; role?: string };
    if (!body.memberId || !body.role) {
      return NextResponse.json({ error: "memberId and role are required" }, { status: 400 });
    }
    if (body.memberId.startsWith("self_")) {
      return NextResponse.json(
        { error: "Create or select an organization to manage roles." },
        { status: 400 },
      );
    }

    const updated = await auth.api.updateMemberRole({
      headers: await headers(),
      body: {
        memberId: body.memberId,
        role: body.role,
      },
    });

    try {
      await recordActivity({
        organizationId: session.session.activeOrganizationId ?? null,
        actorUserId: session.user.id,
        actorName: session.user.name || session.user.email,
        actorImage: session.user.image,
        type: "update",
        action: `${session.user.name?.split(" ")[0] || "User"} changed a team role`,
        resourceType: "member",
        resourceId: body.memberId,
        resourceLabel: body.role,
        resourceHref: "/settings#team",
        details: {
          summary: "Organization member role updated via Better Auth.",
          changes: [{ field: "role", to: body.role }],
        },
      });
    } catch (activityError) {
      console.error("[api/settings/team] activity log failed", activityError);
    }

    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("[api/settings/team] update role failed", error);
    return NextResponse.json({ error: "Failed to update member role" }, { status: 500 });
  }
}
