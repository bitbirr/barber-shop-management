/**
 * Applies app SQL migrations (activity, apiKey, subscription) through the
 * DIRECT_URL / session pooler. Safe to re-run (IF NOT EXISTS).
 */
import { config } from "dotenv";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const databaseUrl = process.env.DATABASE_URL?.trim() || "";
const directUrl = process.env.DIRECT_URL?.trim() || "";
const migrateUrl = directUrl || databaseUrl;

if (!migrateUrl) {
  console.error("Set DIRECT_URL (preferred) or DATABASE_URL before applying migrations.");
  process.exit(1);
}

try {
  const port = new URL(migrateUrl).port || "5432";
  if (port === "6543") {
    console.error("Refusing to run DDL on transaction pooler :6543. Use DIRECT_URL on :5432.");
    process.exit(1);
  }
} catch {
  console.error("Invalid database URL.");
  process.exit(1);
}

const migrationsDir = resolve(process.cwd(), "prisma/migrations");
const folders = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (folders.length === 0) {
  console.error("No migration folders found under prisma/migrations.");
  process.exit(1);
}

let failed = false;
for (const folder of folders) {
  const file = join(migrationsDir, folder, "migration.sql");
  if (!existsSync(file)) {
    console.warn(`Skipping ${folder} (no migration.sql)`);
    continue;
  }

  console.log(`\n→ Applying ${folder}/migration.sql`);
  const result = spawnSync(
    "npx",
    ["prisma", "db", "execute", "--file", file, "--schema", "prisma/schema.prisma"],
    {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        DATABASE_URL: migrateUrl,
        DIRECT_URL: migrateUrl,
      },
    },
  );

  if ((result.status ?? 1) !== 0) {
    console.error(`Failed applying ${folder}`);
    failed = true;
    break;
  }
}

if (failed) process.exit(1);

console.log("\nMarking migrations as applied in Prisma history (baseline)…");
for (const folder of folders) {
  const resolveResult = spawnSync(
    "npx",
    ["prisma", "migrate", "resolve", "--applied", folder],
    {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        DATABASE_URL: migrateUrl,
        DIRECT_URL: migrateUrl,
      },
    },
  );
  // resolve may fail if already applied — continue
  if ((resolveResult.status ?? 1) !== 0) {
    console.warn(`Note: could not mark ${folder} as applied (may already be recorded).`);
  }
}

const gen = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

console.log("\nDone. App tables from migrations are in place.");
process.exit(gen.status ?? 0);
