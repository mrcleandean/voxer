/*
  Warnings:

  - Made the column `content` on table `Vox` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vox" ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "content" SET DATA TYPE TEXT;
