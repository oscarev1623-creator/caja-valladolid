-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" TEXT DEFAULT 'green',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
