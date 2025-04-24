/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the `FileUpdate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FileUpdate" DROP CONSTRAINT "FileUpdate_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "updatedAt",
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "updatedAt",
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "FileUpdate";
