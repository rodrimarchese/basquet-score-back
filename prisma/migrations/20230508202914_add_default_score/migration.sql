-- AlterEnum
ALTER TYPE "PlayerGameDataType" ADD VALUE 'OWN_GOAL';

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "homeScore" SET DEFAULT 0,
ALTER COLUMN "awayScore" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "_homeStarters" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_awayStarters" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_homeStarters_AB_unique" ON "_homeStarters"("A", "B");

-- CreateIndex
CREATE INDEX "_homeStarters_B_index" ON "_homeStarters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_awayStarters_AB_unique" ON "_awayStarters"("A", "B");

-- CreateIndex
CREATE INDEX "_awayStarters_B_index" ON "_awayStarters"("B");

-- AddForeignKey
ALTER TABLE "_homeStarters" ADD CONSTRAINT "_homeStarters_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_homeStarters" ADD CONSTRAINT "_homeStarters_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_awayStarters" ADD CONSTRAINT "_awayStarters_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_awayStarters" ADD CONSTRAINT "_awayStarters_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
