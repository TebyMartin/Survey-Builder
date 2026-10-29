ALTER TYPE "UserRole" ADD VALUE 'SUPERVISOR';

CREATE TYPE "SubmissionReviewStatus" AS ENUM (
    'CHANGES_REQUESTED',
    'UPDATED',
    'APPROVED'
);

ALTER TABLE "submissions"
ADD COLUMN "formNumber" INTEGER;

WITH numbered_submissions AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "surveyId"
            ORDER BY "startedAt", "createdAt", "id"
        )::INTEGER AS form_number
    FROM "submissions"
)
UPDATE "submissions"
SET "formNumber" = numbered_submissions.form_number
FROM numbered_submissions
WHERE "submissions"."id" = numbered_submissions."id";

ALTER TABLE "submissions"
ALTER COLUMN "formNumber" SET NOT NULL;

CREATE UNIQUE INDEX "submissions_surveyId_formNumber_key"
ON "submissions"("surveyId", "formNumber");

CREATE TABLE "submission_reviews" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "SubmissionReviewStatus" NOT NULL DEFAULT 'CHANGES_REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "submission_reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "submission_reviews_submissionId_requestedAt_idx"
ON "submission_reviews"("submissionId", "requestedAt");

CREATE INDEX "submission_reviews_supervisorId_idx"
ON "submission_reviews"("supervisorId");

ALTER TABLE "submission_reviews"
ADD CONSTRAINT "submission_reviews_submissionId_fkey"
FOREIGN KEY ("submissionId") REFERENCES "submissions"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "submission_reviews"
ADD CONSTRAINT "submission_reviews_supervisorId_fkey"
FOREIGN KEY ("supervisorId") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
