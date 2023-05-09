/*
  Warnings:

  - The values [STARTED_GAME] on the enum `PlayerGameDataType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `teamId` to the `PlayerGameData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlayerGameDataType_new" AS ENUM ('SCORE_GOAL', 'ASSIST', 'FOUL', 'SUBBED_IN', 'SUBBED_OUT', 'OWN_GOAL');
ALTER TABLE "PlayerGameData" ALTER COLUMN "data_type" TYPE "PlayerGameDataType_new" USING ("data_type"::text::"PlayerGameDataType_new");
ALTER TYPE "PlayerGameDataType" RENAME TO "PlayerGameDataType_old";
ALTER TYPE "PlayerGameDataType_new" RENAME TO "PlayerGameDataType";
DROP TYPE "PlayerGameDataType_old";
COMMIT;

-- AlterTable
ALTER TABLE "PlayerGameData" ADD COLUMN     "teamId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "PlayerGameData" ADD CONSTRAINT "PlayerGameData_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
