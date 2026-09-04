import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { recordActivity } from "@/lib/activity";
import {
  adminAccessControl,
  organizationRoles,
  orgAccessControl,
  platformRoles,
} from "@/lib/auth-permissions";
import { prisma } from "@/lib/db";
import { sendTemplateEmail } from "@/lib/email/send";
import { RESEND_TEMPLATES } from "@/lib/email/templates";
import { defaultTrustedOrigins } from "@/lib/auth-origins";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;
const isProd = process.env.NODE_ENV === "production";

async function safeSendTemplateEmail(
  args: Parameters<typeof sendTemplateEmail>[0],
  label: string,
) {
  try {
    await sendTemplateEmail(args);
  } catch (error) {
    console.error(`[auth] ${label} email failed`, error);
  }
}

export const auth = betterAuth({
  appName: "Bit-Barber System",
  baseURL: appUrl,
  trustedOrigins: defaultTrustedOrigins(),
  advanced: {
    trustedProxyHeaders: true,
    useSecureCookies: isProd,
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      httpOnly: true,
    },
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"],
    },
    ...(cookieDomain
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: cookieDomain.startsWith(".") ? cookieDomain : `.${cookieDomain}`,
          },
        }
      : {}),
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await safeSendTemplateEmail(
        {
          to: user.email,
          template: RESEND_TEMPLATES.resetPassword,
          variables: {
            USER_NAME: user.name || "there",
            ACTION_URL: url,
            APP_NAME: "Bit-Barber System",
          },
          idempotencyKey: `reset-password/${user.id}/${Date.now()}`,
        },
        "reset password",
      );
    },
    onPasswordReset: async ({ user }) => {
      await safeSendTemplateEmail(
        {
          to: user.email,
          template: RESEND_TEMPLATES.passwordChanged,
          variables: {
            USER_NAME: user.name || "there",
            APP_NAME: "Bit-Barber System",
            SUPPORT_EMAIL: "info@bitbirr.net",
          },
          idempotencyKey: `password-changed/${user.id}/${Date.now()}`,
        },
        "password changed",
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await safeSendTemplateEmail(
        {
          to: user.email,
          template: RESEND_TEMPLATES.verifyEmail,
          variables: {
            USER_NAME: user.name || "there",
            ACTION_URL: url,
            APP_NAME: "Bit-Barber System",
          },
          idempotencyKey: `verify-email/${user.id}`,
        },
        "verify",
      );
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await safeSendTemplateEmail(
          {
            to: user.email,
            template: RESEND_TEMPLATES.verifyEmail,
            variables: {
              USER_NAME: user.name || "there",
              ACTION_URL: url,
              APP_NAME: "Bit-Barber System",
            },
            idempotencyKey: `change-email-confirm/${user.id}/${newEmail}`,
          },
          "change email confirmation",
        );
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await safeSendTemplateEmail(
            {
              to: user.email,
              template: RESEND_TEMPLATES.welcome,
              variables: {
                USER_NAME: user.name || "there",
                APP_NAME: "Bit-Barber System",
                DASHBOARD_URL: `${appUrl}/dashboard`,
              },
              idempotencyKey: `welcome/${user.id}`,
            },
            "welcome",
          );

          try {
            await recordActivity({
              actorUserId: user.id,
              actorName: user.name || user.email,
              actorImage: user.image,
              type: "alert",
              action: `${user.name || "A user"} joined Bit-Barber`,
              resourceType: "user",
              resourceId: user.id,
              resourceLabel: user.email,
              resourceHref: "/users",
              details: {
                summary: "New account created with email verification required.",
                metadata: { emailVerified: user.emailVerified },
              },
            });
          } catch (error) {
            console.error("[auth] activity log on user create failed", error);
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          if (session.activeOrganizationId) {
            return { data: session };
          }
          try {
            const membership = await prisma.member.findFirst({
              where: { userId: session.userId },
              orderBy: { createdAt: "asc" },
              select: { organizationId: true },
            });
            if (!membership) return { data: session };
            return {
              data: {
                ...session,
                activeOrganizationId: membership.organizationId,
              },
            };
          } catch (error) {
            console.error("[auth] failed to set active organization on session create", error);
            return { data: session };
          }
        },
        after: async (session) => {
          try {
            const user = await prisma.user.findUnique({
              where: { id: session.userId },
              select: { id: true, name: true, email: true, image: true },
            });
            if (!user) return;

            const activeOrganizationId =
              typeof session.activeOrganizationId === "string"
                ? session.activeOrganizationId
                : null;

            await recordActivity({
              organizationId: activeOrganizationId,
              actorUserId: user.id,
              actorName: user.name || user.email,
              actorImage: user.image,
              type: "alert",
              action: `${user.name?.split(" ")[0] || "User"} signed in`,
              resourceType: "session",
              resourceId: session.id,
              resourceLabel: "Security session",
              resourceHref: "/settings",
              details: {
                summary: "Session created through Better Auth with advanced cookie and proxy settings.",
                ipAddress: typeof session.ipAddress === "string" ? session.ipAddress : null,
                userAgent: typeof session.userAgent === "string" ? session.userAgent : null,
                metadata: {
                  activeOrganizationId,
                  cookieCache: true,
                },
              },
            });
          } catch (error) {
            console.error("[auth] activity log on session create failed", error);
          }
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: "compact",
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/change-email": { window: 60, max: 3 },
      "/change-password": { window: 60, max: 3 },
      "/update-user": { window: 60, max: 20 },
    },
  },
  plugins: [
    admin({
      ac: adminAccessControl,
      roles: platformRoles,
      defaultRole: "viewer",
      adminRoles: ["admin"],
    }),
    organization({
      ac: orgAccessControl,
      roles: organizationRoles,
      allowUserToCreateOrganization: async (user) => {
        return user.emailVerified === true;
      },
      organizationLimit: 10,
      membershipLimit: 100,
      invitationExpiresIn: 60 * 60 * 24 * 7,
      invitationLimit: 50,
      creatorRole: "owner",
      cancelPendingInvitationsOnReInvite: true,
      teams: {
        enabled: true,
        maximumTeams: 20,
        maximumMembersPerTeam: 50,
        allowRemovingAllTeams: false,
      },
      async sendInvitationEmail(data) {
        const inviteUrl = `${appUrl}/accept-invite?invitationId=${data.invitation.id}`;
        await safeSendTemplateEmail(
          {
            to: data.email,
            template: RESEND_TEMPLATES.orgInvitation,
            variables: {
              INVITER_NAME: data.inviter.user.name || "A teammate",
              ORGANIZATION_NAME: data.organization.name,
              ROLE: String(data.invitation.role || "member"),
              ACTION_URL: inviteUrl,
              APP_NAME: "Bit-Barber System",
            },
            idempotencyKey: `org-invite/${data.invitation.id}`,
          },
          "org invitation",
        );
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
