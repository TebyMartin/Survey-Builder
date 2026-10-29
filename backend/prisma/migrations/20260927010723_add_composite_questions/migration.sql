-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'COMPOSITE';

-- CreateTable
CREATE TABLE "composite_fields" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "defaultValue" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composite_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composite_field_options" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "isOther" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composite_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composite_answers" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composite_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "composite_fields_questionId_idx" ON "composite_fields"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "composite_fields_questionId_order_key" ON "composite_fields"("questionId", "order");

-- CreateIndex
CREATE INDEX "composite_field_options_fieldId_idx" ON "composite_field_options"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "composite_field_options_fieldId_order_key" ON "composite_field_options"("fieldId", "order");

-- CreateIndex
CREATE INDEX "composite_answers_answerId_idx" ON "composite_answers"("answerId");

-- CreateIndex
CREATE INDEX "composite_answers_fieldId_idx" ON "composite_answers"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "composite_answers_answerId_fieldId_key" ON "composite_answers"("answerId", "fieldId");

-- AddForeignKey
ALTER TABLE "composite_fields" ADD CONSTRAINT "composite_fields_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composite_field_options" ADD CONSTRAINT "composite_field_options_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "composite_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composite_answers" ADD CONSTRAINT "composite_answers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composite_answers" ADD CONSTRAINT "composite_answers_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "composite_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
