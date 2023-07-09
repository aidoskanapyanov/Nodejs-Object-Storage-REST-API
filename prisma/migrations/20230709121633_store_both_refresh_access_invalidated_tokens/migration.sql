/*
  Warnings:

  - You are about to drop the column `token` on the `InvalidatedToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `InvalidatedToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `InvalidatedToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `InvalidatedToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `InvalidatedToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `InvalidatedToken_token_key` ON `InvalidatedToken`;

-- AlterTable
ALTER TABLE `InvalidatedToken` DROP COLUMN `token`,
    ADD COLUMN `accessToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `InvalidatedToken_accessToken_key` ON `InvalidatedToken`(`accessToken`);

-- CreateIndex
CREATE UNIQUE INDEX `InvalidatedToken_refreshToken_key` ON `InvalidatedToken`(`refreshToken`);
