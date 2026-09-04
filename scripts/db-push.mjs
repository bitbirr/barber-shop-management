import { config } from "dotenv";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const databaseUrl = process.env.DATABASE_URL?.trim() || "";
const directUrl = process.env.DIRECT_URL?.trim() || "";

function portOf(url) {
  try {
    return new URL(url).port || "5432";
  } catch {
    return null;
  }
}

if (!databaseUrl && !directUrl) {
  console.error("Set DATABASE_URL and DIRECT_URL in .env before pushing schema.");
  process.exit(1);
}

if (portOf(databaseUrl) === "6543" && !directUrl) {
  console.error(
    "DATABASE_URL points at the Supabase transaction pooler (:6543).\n" +
      "Prisma DDL (db push / migrate) hangs there.\n" +
      "Set DIRECT_URL to the session pooler (:5432) or the direct db.*.supabase.co host.",
  );
  process.exit(1);
}

const migrateUrl = directUrl || databaseUrl;
if (portOf(migrateUrl) === "6543") {
  console.error(
    "DIRECT_URL/DATABASE_URL still uses :6543 (transaction pooler). Use :5432 session pooler or the direct host.",
  );
  process.exit(1);
}

console.log(
  `Pushing Prisma schema via ${directUrl ? "DIRECT_URL" : "DATABASE_URL"} (port ${portOf(migrateUrl)})…`,
);

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--skip-generate"],
  {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      // Prisma uses directUrl for DDL when set; also override DATABASE_URL so push never hits :6543.
      DATABASE_URL: migrateUrl,
      DIRECT_URL: migrateUrl,
    },
  },
);

if ((result.status ?? 1) === 0) {
  const gen = spawnSync("npx", ["prisma", "generate"], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  process.exit(gen.status ?? 1);
}

process.exit(result.status ?? 1);
