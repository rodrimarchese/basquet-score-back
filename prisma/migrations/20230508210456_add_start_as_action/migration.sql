/*
  Warnings:

  - You are about to drop the column `awayStarterIds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `homeStarterIds` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `_awayStarters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_homeStarters` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PlayerGameDataType" ADD VALUE 'STARTED_GAME';

-- DropForeignKey
ALTER TABLE "_awayStarters" DROP CONSTRAINT "_awayStarters_A_fkey";

-- DropForeignKey
ALTER TABLE "_awayStarters" DROP CONSTRAINT "_awayStarters_B_fkey";

-- DropForeignKey
ALTER TABLE "_homeStarters" DROP CONSTRAINT "_homeStarters_A_fkey";

-- DropForeignKey
ALTER TABLE "_homeStarters" DROP CONSTRAINT "_homeStarters_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "awayStarterIds",
DROP COLUMN "homeStarterIds";

-- DropTable
DROP TABLE "_awayStarters";

-- DropTable
DROP TABLE "_homeStarters";
