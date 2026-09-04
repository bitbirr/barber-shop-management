-- Consolidated app schema (idempotent). Better Auth tables are assumed to exist.
-- Prefer: npm run db:push  (uses DIRECT_URL / session pooler)
-- Or:     npm run db:migrate:apply

-- activity
CREATE TABLE IF NOT EXISTS "activity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "actorUserId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorImage" TEXT,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "resourceLabel" TEXT,
    "resourceHref" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "activity_organizationId_createdAt_idx" ON "activity"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "activity_type_createdAt_idx" ON "activity"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "activity_actorUserId_idx" ON "activity"("actorUserId");
CREATE INDEX IF NOT EXISTS "activity_createdAt_idx" ON "activity"("createdAt");

DO $$ BEGIN
  ALTER TABLE "activity" ADD CONSTRAINT "activity_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "activity" ADD CONSTRAINT "activity_actorUserId_fkey"
    FOREIGN KEY ("actorUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- apiKey
CREATE TABLE IF NOT EXISTS "apiKey" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Default',
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- subscription
CREATE TABLE IF NOT EXISTS "subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "customerUserId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "plan" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "mrr" INTEGER NOT NULL,
    "nextInvoiceAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "subscription_organizationId_mrr_idx" ON "subscription"("organizationId", "mrr");
CREATE INDEX IF NOT EXISTS "subscription_plan_idx" ON "subscription"("plan");
CREATE INDEX IF NOT EXISTS "subscription_status_idx" ON "subscription"("status");
CREATE INDEX IF NOT EXISTS "subscription_customerUserId_idx" ON "subscription"("customerUserId");
CREATE INDEX IF NOT EXISTS "subscription_nextInvoiceAt_idx" ON "subscription"("nextInvoiceAt");

DO $$ BEGIN
  ALTER TABLE "subscription" ADD CONSTRAINT "subscription_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "subscription" ADD CONSTRAINT "subscription_customerUserId_fkey"
    FOREIGN KEY ("customerUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
