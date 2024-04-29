/*
  Warnings:

  - You are about to drop the column `type` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `VoxVote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isVoxxed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "type",
ADD COLUMN     "net" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vox" ADD COLUMN     "isVoxxed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VoxVote" DROP COLUMN "type",
ADD COLUMN     "net" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Cooldowns" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentCooldownEnds" TIMESTAMP(3) NOT NULL,
    "voxCooldownEnds" TIMESTAMP(3) NOT NULL,
    "voteCooldownEnds" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cooldowns_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooldowns_userId_key" ON "Cooldowns"("userId");

-- AddForeignKey
ALTER TABLE "Cooldowns" ADD CONSTRAINT "Cooldowns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
