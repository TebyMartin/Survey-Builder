-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'MATRIX';

-- CreateTable
CREATE TABLE "question_matrix_rows" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "question_matrix_rows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_matrix_rows_questionId_idx" ON "question_matrix_rows"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_matrix_rows_questionId_order_key" ON "question_matrix_rows"("questionId", "order");

-- AddForeignKey
ALTER TABLE "question_matrix_rows" ADD CONSTRAINT "question_matrix_rows_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
