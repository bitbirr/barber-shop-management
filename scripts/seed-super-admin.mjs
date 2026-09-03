import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { createLocalAccountIssuer } from "@better-auth/core/db";
import { PrismaClient } from "@prisma/client";

config({ path: ".env" });
config({ path: ".env.local" });

const email = "info@bitbirr.net";
const name = "BitBirr Super Admin";
const password = `Bs!${randomBytes(12).toString("base64url")}`;
const hash = await hashPassword(password);
const issuer = createLocalAccountIssuer("credential");
const userId = `admin_${randomBytes(8).toString("hex")}`;
const accountId = `acct_${randomBytes(8).toString("hex")}`;

const prisma = new PrismaClient();

try {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "admin", emailVerified: true, banned: false },
    });
    process.stdout.write(
      JSON.stringify({
        created: false,
        email,
        note: "User already existed; role set to admin. Password unchanged.",
      })
    );
  } else {
    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            id: accountId,
            issuer,
            accountId: userId,
            providerId: "credential",
            password: hash,
          },
        },
      },
    });
    process.stdout.write(JSON.stringify({ created: true, email, password, name, role: "admin" }));
  }
} finally {
  await prisma.$disconnect();
}
