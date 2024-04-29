/*
  Warnings:

  - A unique constraint covering the columns `[voxId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_voxId_key" ON "Vote"("voxId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_commentId_key" ON "Vote"("commentId");
