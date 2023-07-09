-- AlterTable
ALTER TABLE `InvalidatedToken` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `InvalidatedToken` ADD CONSTRAINT `InvalidatedToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
