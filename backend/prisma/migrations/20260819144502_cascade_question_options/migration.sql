-- DropForeignKey
ALTER TABLE "question_options" DROP CONSTRAINT "question_options_questionId_fkey";

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
