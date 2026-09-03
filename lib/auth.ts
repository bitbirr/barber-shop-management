import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { prisma } from "@/lib/db";
import { sendTemplateEmail } from "@/lib/email/send";
import { RESEND_TEMPLATES } from "@/lib/email/templates";
import { defaultTrustedOrigins } from "@/lib/auth-origins";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

export const auth = betterAuth({
  appName: "Bit-Barber System",
  baseURL: appUrl,
  trustedOrigins: defaultTrustedOrigins(),
  advanced: {
    trustedProxyHeaders: true,
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
      void sendTemplateEmail({
        to: user.email,
        template: RESEND_TEMPLATES.resetPassword,
        variables: {
          USER_NAME: user.name || "there",
          ACTION_URL: url,
          APP_NAME: "Barber Shop Management",
        },
        idempotencyKey: `reset-password/${user.id}/${Date.now()}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      void sendTemplateEmail({
        to: user.email,
        template: RESEND_TEMPLATES.passwordChanged,
        variables: {
          USER_NAME: user.name || "there",
          APP_NAME: "Barber Shop Management",
          SUPPORT_EMAIL: "info@bitbirr.net",
        },
        idempotencyKey: `password-changed/${user.id}/${Date.now()}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendTemplateEmail({
        to: user.email,
        template: RESEND_TEMPLATES.verifyEmail,
        variables: {
          USER_NAME: user.name || "there",
          ACTION_URL: url,
          APP_NAME: "Barber Shop Management",
        },
        idempotencyKey: `verify-email/${user.id}/${Date.now()}`,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          void sendTemplateEmail({
            to: user.email,
            template: RESEND_TEMPLATES.welcome,
            variables: {
              USER_NAME: user.name || "there",
              APP_NAME: "Barber Shop Management",
              DASHBOARD_URL: `${appUrl}/dashboard`,
            },
            idempotencyKey: `welcome/${user.id}`,
          });
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
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    organization({
      allowUserToCreateOrganization: async (user) => {
        return user.emailVerified === true;
      },
      organizationLimit: 10,
      membershipLimit: 100,
      invitationExpiresIn: 60 * 60 * 24 * 7,
      invitationLimit: 50,
      creatorRole: "owner",
      teams: {
        enabled: true,
        maximumTeams: 20,
        maximumMembersPerTeam: 50,
        allowRemovingAllTeams: false,
      },
      async sendInvitationEmail(data) {
        const inviteUrl = `${appUrl}/accept-invite?invitationId=${data.invitation.id}`;
        await sendTemplateEmail({
          to: data.email,
          template: RESEND_TEMPLATES.orgInvitation,
          variables: {
            INVITER_NAME: data.inviter.user.name || "A teammate",
            ORGANIZATION_NAME: data.organization.name,
            ROLE: String(data.invitation.role || "member"),
            ACTION_URL: inviteUrl,
            APP_NAME: "Barber Shop Management",
          },
          idempotencyKey: `org-invite/${data.invitation.id}`,
        });
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
