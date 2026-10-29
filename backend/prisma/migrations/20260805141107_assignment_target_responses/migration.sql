-- AlterTable
ALTER TABLE "survey_assignments" ADD COLUMN     "completedResponses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targetResponses" INTEGER NOT NULL DEFAULT 1;
