import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  const count = await prisma.user.count();
  console.log(JSON.stringify({ ok: true, userCount: count, hasDatabaseUrl: Boolean(process.env.DATABASE_URL) }));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
