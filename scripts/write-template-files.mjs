import { writeFileSync } from "node:fs";
import { AUTH_EMAIL_TEMPLATES } from "./auth-email-templates.mjs";

for (const template of AUTH_EMAIL_TEMPLATES) {
  writeFileSync(`scripts/${template.alias}.html`, template.html);
  writeFileSync(`scripts/${template.alias}.txt`, template.text);
}
