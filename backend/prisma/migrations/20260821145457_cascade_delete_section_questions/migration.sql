-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
