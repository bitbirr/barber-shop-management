import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

export type ApiKeyPublic = {
  id: string;
  name: string;
  /** Masked display value, e.g. bb_live_••••••••abcd */
  maskedKey: string;
  keyPrefix: string;
  lastFour: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
};

export function hashApiKey(rawKey: string) {
  return createHash("sha256").update(rawKey).digest("hex");
}

export function generateApiKeyPlaintext() {
  const body = randomBytes(24).toString("base64url");
  return `bb_live_${body}`;
}

export function maskApiKey(prefix: string, lastFour: string) {
  return `${prefix}${"•".repeat(12)}${lastFour}`;
}

export function toApiKeyPublic(row: {
  id: string;
  name: string;
  keyPrefix: string;
  lastFour: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
}): ApiKeyPublic {
  return {
    id: row.id,
    name: row.name,
    maskedKey: maskApiKey(row.keyPrefix, row.lastFour),
    keyPrefix: row.keyPrefix,
    lastFour: row.lastFour,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastUsedAt: row.lastUsedAt?.toISOString() ?? null,
  };
}

export async function ensureDefaultApiKey(organizationId: string | null, createdById: string) {
  const existing = await prisma.apiKey.findFirst({
    where: organizationId ? { organizationId } : { organizationId: null, createdById },
    orderBy: { createdAt: "asc" },
  });
  if (existing) {
    return { key: toApiKeyPublic(existing), plaintext: null as string | null, created: false };
  }

  const plaintext = generateApiKeyPlaintext();
  const keyPrefix = plaintext.slice(0, 8);
  const lastFour = plaintext.slice(-4);
  const row = await prisma.apiKey.create({
    data: {
      organizationId,
      createdById,
      name: "Default",
      keyPrefix,
      keyHash: hashApiKey(plaintext),
      lastFour,
    },
  });

  return { key: toApiKeyPublic(row), plaintext, created: true };
}
