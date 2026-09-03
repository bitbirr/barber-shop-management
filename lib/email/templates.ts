/** Resend template aliases used by Better Auth email flows. */
export const RESEND_TEMPLATES = {
  verifyEmail: "barber-verify-email",
  resetPassword: "barber-reset-password",
  orgInvitation: "barber-org-invitation",
  welcome: "barber-welcome",
  passwordChanged: "barber-password-changed",
} as const;

export type ResendTemplateAlias =
  (typeof RESEND_TEMPLATES)[keyof typeof RESEND_TEMPLATES];

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Barber Shop <info@bitbirr.net>";
