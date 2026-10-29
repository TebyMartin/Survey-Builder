-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "allowAnonymousByDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#1976D2',
ADD COLUMN     "secondaryColor" TEXT DEFAULT '#9C27B0';
