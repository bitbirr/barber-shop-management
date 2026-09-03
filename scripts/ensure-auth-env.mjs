import fs from "node:fs";
import crypto from "node:crypto";

const path = ".env";
let env = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
if (!/BETTER_AUTH_SECRET=/.test(env)) {
  fs.appendFileSync(path, `\nBETTER_AUTH_SECRET=${crypto.randomBytes(32).toString("base64")}\n`);
}
if (!/BETTER_AUTH_URL=/.test(env)) {
  fs.appendFileSync(path, "BETTER_AUTH_URL=http://localhost:3000\n");
}
if (!/EMAIL_FROM=/.test(env)) {
  fs.appendFileSync(path, 'EMAIL_FROM="Barber Shop <info@bitbirr.net>"\n');
}
console.log("env keys ensured");
