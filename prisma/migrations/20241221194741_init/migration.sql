/*
  Warnings:

  - You are about to drop the column `cookie_id` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cookieId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cookieId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "cookie_id",
ADD COLUMN     "cookieId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_cookieId_key" ON "Conversation"("cookieId");
