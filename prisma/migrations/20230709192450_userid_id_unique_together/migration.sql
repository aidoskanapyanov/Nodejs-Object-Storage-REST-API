/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `File_id_userId_key` ON `File`(`id`, `userId`);
