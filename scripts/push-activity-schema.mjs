import { config } from "dotenv";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is missing. Set it in .env or .env.local before pushing the activity schema.");
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
