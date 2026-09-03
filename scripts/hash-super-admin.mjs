import { hashPassword } from "better-auth/crypto";
import { randomBytes } from "node:crypto";

const email = process.env.SUPER_ADMIN_EMAIL ?? "info@bitbirr.net";
const name = process.env.SUPER_ADMIN_NAME ?? "BitBirr Super Admin";
const password =
  process.env.SUPER_ADMIN_PASSWORD ??
  `Bs!${randomBytes(12).toString("base64url")}`;

const hash = await hashPassword(password);
process.stdout.write(
  JSON.stringify({
    email,
    name,
    password,
    hash,
    userId: `admin_${randomBytes(8).toString("hex")}`,
    accountId: `acct_${randomBytes(8).toString("hex")}`,
  })
);
