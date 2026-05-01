/*
  Warnings:

  - A unique constraint covering the columns `[chatToken]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChatConversation" ADD COLUMN     "leadId" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "chatToken" TEXT,
ADD COLUMN     "lastReminderSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'agent';

-- CreateIndex
CREATE UNIQUE INDEX "Lead_chatToken_key" ON "Lead"("chatToken");

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
