/*
  Warnings:

  - You are about to drop the column `allowAnonymousByDefault` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "allowAnonymousByDefault";
