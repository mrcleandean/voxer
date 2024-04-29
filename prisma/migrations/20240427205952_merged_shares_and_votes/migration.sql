/*
  Warnings:

  - You are about to drop the column `lang` on the `Preferences` table. All the data in the column will be lost.
  - You are about to drop the `CommentVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReCom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReVox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoxVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReCom" DROP CONSTRAINT "ReCom_commentId_fkey";

-- DropForeignKey
ALTER TABLE "ReCom" DROP CONSTRAINT "ReCom_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReVox" DROP CONSTRAINT "ReVox_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReVox" DROP CONSTRAINT "ReVox_voxId_fkey";

-- DropForeignKey
ALTER TABLE "VoxVote" DROP CONSTRAINT "VoxVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoxVote" DROP CONSTRAINT "VoxVote_voxId_fkey";

-- AlterTable
ALTER TABLE "Cooldowns" ADD COLUMN     "reshareCooldownEnds" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "lang",
ADD COLUMN     "showComments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showVoted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showVoxes" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "CommentVote";

-- DropTable
DROP TABLE "ReCom";

-- DropTable
DROP TABLE "ReVox";

-- DropTable
DROP TABLE "VoxVote";

-- DropEnum
DROP TYPE "VoteTypes";

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voxId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "net" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReShare" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voxId" TEXT,
    "commentId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_voxId_key" ON "Vote"("userId", "voxId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_commentId_key" ON "Vote"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voxId_fkey" FOREIGN KEY ("voxId") REFERENCES "Vox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReShare" ADD CONSTRAINT "ReShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReShare" ADD CONSTRAINT "ReShare_voxId_fkey" FOREIGN KEY ("voxId") REFERENCES "Vox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReShare" ADD CONSTRAINT "ReShare_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
