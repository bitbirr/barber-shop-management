import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  normalizePlatformRole,
  platformRoleToOrgRole,
  type PlatformRole,
  PLATFORM_ROLE_OPTIONS,
} from "@/lib/auth-permissions";
import { sendTemplateEmail } from "@/lib/email/send";
import { RESEND_TEMPLATES } from "@/lib/email/templates";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

function isPlatformRole(value: string): value is PlatformRole {
  return PLATFORM_ROLE_OPTIONS.some((option) => option.value === value);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const actorRole = normalizePlatformRole(session.user.role as string | undefined);
  if (actorRole !== "admin") {
    return NextResponse.json({ error: "Only admins can invite users" }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    role?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const role = body.role?.trim().toLowerCase() ?? "viewer";

  if (!name || !email || !isPlatformRole(role)) {
    return NextResponse.json({ error: "name, email, and a valid role are required" }, { status: 400 });
  }

  try {
    const temporaryPassword = `Bb!${randomBytes(18).toString("base64url")}`;

    const created = await auth.api.createUser({
      headers: await headers(),
      body: {
        name,
        email,
        password: temporaryPassword,
        role,
      },
    });

    // Prefer org invitation when the admin has an active workspace.
    const organizationId = session.session.activeOrganizationId;
    if (organizationId) {
      try {
        await auth.api.createInvitation({
          headers: await headers(),
          body: {
            email,
            role: platformRoleToOrgRole(role),
            organizationId,
            resend: true,
          },
        });
      } catch (inviteError) {
        console.error("[api/users/invite] org invite failed, falling back to reset email", inviteError);
        await auth.api.requestPasswordReset({
          body: {
            email,
            redirectTo: `${appUrl}/reset-password`,
          },
        });
      }
    } else {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `${appUrl}/reset-password`,
        },
      });

      await sendTemplateEmail({
        to: email,
        template: RESEND_TEMPLATES.orgInvitation,
        variables: {
          INVITER_NAME: session.user.name || "A teammate",
          ORGANIZATION_NAME: "Bit-Barber System",
          ROLE: role,
          ACTION_URL: `${appUrl}/forgot-password`,
          APP_NAME: "Bit-Barber System",
        },
        idempotencyKey: `user-invite/${created.user.id}`,
      }).catch((error) => console.error("[api/users/invite] invite email failed", error));
    }

    return NextResponse.json({
      user: {
        id: created.user.id,
        name: created.user.name,
        email: created.user.email,
        role: normalizePlatformRole(created.user.role as string | undefined),
      },
    });
  } catch (error) {
    console.error("[api/users/invite] failed", error);
    const message = error instanceof Error ? error.message : "Failed to invite user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
