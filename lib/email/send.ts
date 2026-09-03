import { Resend } from "resend";
import {
  EMAIL_FROM,
  type ResendTemplateAlias,
} from "@/lib/email/templates";

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

type SendTemplateEmailArgs = {
  to: string | string[];
  template: ResendTemplateAlias;
  variables: Record<string, string | number>;
  subject?: string;
  idempotencyKey?: string;
};

export async function sendTemplateEmail({
  to,
  template,
  variables,
  subject,
  idempotencyKey,
}: SendTemplateEmailArgs) {
  const resend = getResend();
  const { data, error } = await resend.emails.send(
    {
      from: EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      ...(subject ? { subject } : {}),
      template: {
        id: template,
        variables,
      },
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}
