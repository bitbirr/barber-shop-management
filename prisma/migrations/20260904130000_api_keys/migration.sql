-- CreateTable
CREATE TABLE IF NOT EXISTS "apiKey" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Default',
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "createdById" TEXT,

    CONSTRAINT "apiKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "apiKey_keyHash_key" ON "apiKey"("keyHash");
CREATE INDEX IF NOT EXISTS "apiKey_organizationId_idx" ON "apiKey"("organizationId");
CREATE INDEX IF NOT EXISTS "apiKey_createdById_idx" ON "apiKey"("createdById");

DO $$ BEGIN
  ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
