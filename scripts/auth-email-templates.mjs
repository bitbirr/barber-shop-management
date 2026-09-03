function emailLayout(title, body, buttonLabel, buttonUrl) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef3f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef3f0" style="background-color:#eef3f0;">
    <tr>
      <td align="center" style="padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;">
          <tr>
            <td bgcolor="#0f766e" style="background-color:#0f766e;padding-top:24px;padding-bottom:24px;padding-left:32px;padding-right:32px;">
              <p style="margin:0;font-family:Georgia, 'Times New Roman', serif;font-size:22px;line-height:28px;color:#ffffff;">Faded</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;padding-bottom:8px;padding-left:32px;padding-right:32px;">
              <h1 style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:24px;line-height:32px;color:#111111;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;padding-bottom:24px;padding-left:32px;padding-right:32px;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">
              ${body}
            </td>
          </tr>
          ${
            buttonUrl
              ? `<tr>
            <td align="left" style="padding-bottom:32px;padding-left:32px;padding-right:32px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#0f766e" style="background-color:#0f766e;">
                    <a href="${buttonUrl}" style="display:inline-block;padding-top:12px;padding-bottom:12px;padding-left:20px;padding-right:20px;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:20px;color:#ffffff;text-decoration:none;">${buttonLabel}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding-top:0;padding-bottom:28px;padding-left:32px;padding-right:32px;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:20px;color:#667066;">
              If you did not expect this email, you can ignore it.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const AUTH_EMAIL_TEMPLATES = [
  {
    name: "Barber Verify Email",
    alias: "barber-verify-email",
    subject: "Verify your {{{APP_NAME}}} email",
    from: "Barber Shop <info@bitbirr.net>",
    variables: [
      { key: "USER_NAME", type: "string", fallbackValue: "there" },
      { key: "APP_NAME", type: "string", fallbackValue: "Barber Shop Management" },
      { key: "ACTION_URL", type: "string" },
    ],
    html: emailLayout(
      "Verify your email",
      `<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Hi {{{USER_NAME}}},</p><p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Confirm this address to finish setting up {{{APP_NAME}}}.</p>`,
      "Verify email",
      "{{{ACTION_URL}}}"
    ),
    text: "Hi {{{USER_NAME}}}, verify your email: {{{ACTION_URL}}}",
  },
  {
    name: "Barber Reset Password",
    alias: "barber-reset-password",
    subject: "Reset your {{{APP_NAME}}} password",
    from: "Barber Shop <info@bitbirr.net>",
    variables: [
      { key: "USER_NAME", type: "string", fallbackValue: "there" },
      { key: "APP_NAME", type: "string", fallbackValue: "Barber Shop Management" },
      { key: "ACTION_URL", type: "string" },
    ],
    html: emailLayout(
      "Reset your password",
      `<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Hi {{{USER_NAME}}},</p><p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Use the button below to choose a new password for {{{APP_NAME}}}.</p>`,
      "Choose new password",
      "{{{ACTION_URL}}}"
    ),
    text: "Hi {{{USER_NAME}}}, reset your password: {{{ACTION_URL}}}",
  },
  {
    name: "Barber Organization Invitation",
    alias: "barber-org-invitation",
    subject: "Join {{{ORGANIZATION_NAME}}} on {{{APP_NAME}}}",
    from: "Barber Shop <info@bitbirr.net>",
    variables: [
      { key: "INVITER_NAME", type: "string", fallbackValue: "A teammate" },
      { key: "ORGANIZATION_NAME", type: "string", fallbackValue: "a shop" },
      { key: "ROLE", type: "string", fallbackValue: "member" },
      { key: "APP_NAME", type: "string", fallbackValue: "Barber Shop Management" },
      { key: "ACTION_URL", type: "string" },
    ],
    html: emailLayout(
      "You're invited",
      `<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">{{{INVITER_NAME}}} invited you to join {{{ORGANIZATION_NAME}}} as {{{ROLE}}}.</p><p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Accept to start working in {{{APP_NAME}}}.</p>`,
      "Accept invitation",
      "{{{ACTION_URL}}}"
    ),
    text: "{{{INVITER_NAME}}} invited you to {{{ORGANIZATION_NAME}}}. Accept: {{{ACTION_URL}}}",
  },
  {
    name: "Barber Welcome",
    alias: "barber-welcome",
    subject: "Welcome to {{{APP_NAME}}}",
    from: "Barber Shop <info@bitbirr.net>",
    variables: [
      { key: "USER_NAME", type: "string", fallbackValue: "there" },
      { key: "APP_NAME", type: "string", fallbackValue: "Barber Shop Management" },
      { key: "DASHBOARD_URL", type: "string", fallbackValue: "http://localhost:3000/dashboard" },
    ],
    html: emailLayout(
      "Welcome aboard",
      `<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Hi {{{USER_NAME}}},</p><p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Your {{{APP_NAME}}} account is ready. Open the dashboard when you are.</p>`,
      "Open dashboard",
      "{{{DASHBOARD_URL}}}"
    ),
    text: "Hi {{{USER_NAME}}}, your {{{APP_NAME}}} account is ready: {{{DASHBOARD_URL}}}",
  },
  {
    name: "Barber Password Changed",
    alias: "barber-password-changed",
    subject: "Your {{{APP_NAME}}} password was changed",
    from: "Barber Shop <info@bitbirr.net>",
    variables: [
      { key: "USER_NAME", type: "string", fallbackValue: "there" },
      { key: "APP_NAME", type: "string", fallbackValue: "Barber Shop Management" },
      { key: "SUPPORT_EMAIL", type: "string", fallbackValue: "info@bitbirr.net" },
    ],
    html: emailLayout(
      "Password updated",
      `<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Hi {{{USER_NAME}}},</p><p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:24px;color:#333333;">Your {{{APP_NAME}}} password was changed. If this was not you, contact {{{SUPPORT_EMAIL}}} immediately.</p>`,
      "",
      ""
    ),
    text: "Hi {{{USER_NAME}}}, your {{{APP_NAME}}} password was changed. Contact {{{SUPPORT_EMAIL}}} if this was not you.",
  },
];
