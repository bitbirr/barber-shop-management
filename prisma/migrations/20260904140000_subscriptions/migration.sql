-- CreateTable
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
