import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    ok: true,
    app: "bit-barber-system",
    betterAuthUrl: Boolean(process.env.BETTER_AUTH_URL),
    betterAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    resendApiKey: Boolean(process.env.RESEND_API_KEY),
    db: "unknown" as "up" | "down" | "unknown",
    dbError: null as string | null,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = "up";
  } catch (error) {
    checks.ok = false;
    checks.db = "down";
    const message = error instanceof Error ? error.message : String(error);
    if (/credentials|Authentication failed|P1000/i.test(message)) {
      checks.dbError = "DB_AUTH_FAILED";
    } else if (/Can't reach database server|P1001/i.test(message)) {
      checks.dbError = "DB_UNREACHABLE";
    } else {
      checks.dbError = "DB_ERROR";
    }
  }

  return NextResponse.json(checks, { status: checks.ok ? 200 : 503 });
}
