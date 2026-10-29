-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "assignmentId" TEXT;

-- CreateIndex
CREATE INDEX "submissions_assignmentId_idx" ON "submissions"("assignmentId");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "survey_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
