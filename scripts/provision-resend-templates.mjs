import { config } from "dotenv";
import { Resend } from "resend";
import { AUTH_EMAIL_TEMPLATES } from "./auth-email-templates.mjs";

config({ path: ".env" });
config({ path: ".env.local" });

const apiKey = process.env.RESEND_API_KEY?.trim().replace(/^["']|["']$/g, "");
if (!apiKey) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(apiKey);
const results = [];

for (const template of AUTH_EMAIL_TEMPLATES) {
  const { data, error } = await resend.templates.create({
    name: template.name,
    alias: template.alias,
    from: template.from,
    subject: template.subject,
    html: template.html,
    text: template.text,
    variables: template.variables,
  });

  if (error) {
    results.push({ alias: template.alias, error: error.message });
    continue;
  }

  const published = await resend.templates.publish(data.id);
  results.push({
    alias: template.alias,
    id: data.id,
    published: !published.error,
    publishError: published.error?.message ?? null,
  });
}

process.stdout.write(JSON.stringify(results, null, 2));
