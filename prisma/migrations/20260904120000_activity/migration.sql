-- CreateTable
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

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_organizationId_createdAt_idx" ON "activity"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_type_createdAt_idx" ON "activity"("type", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_actorUserId_idx" ON "activity"("actorUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_createdAt_idx" ON "activity"("createdAt");

-- AddForeignKey
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
