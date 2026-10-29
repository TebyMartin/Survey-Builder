-- CreateTable
CREATE TABLE "answer_matrix" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "rowId" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "answer_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "answer_matrix_answerId_idx" ON "answer_matrix"("answerId");

-- CreateIndex
CREATE INDEX "answer_matrix_rowId_idx" ON "answer_matrix"("rowId");

-- CreateIndex
CREATE UNIQUE INDEX "answer_matrix_answerId_rowId_key" ON "answer_matrix"("answerId", "rowId");

-- AddForeignKey
ALTER TABLE "answer_matrix" ADD CONSTRAINT "answer_matrix_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_matrix" ADD CONSTRAINT "answer_matrix_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "question_matrix_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
