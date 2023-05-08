/*
  Warnings:

  - Added the required column `data_value` to the `PlayerGameData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerGameData" ADD COLUMN     "data_value" TEXT NOT NULL;
