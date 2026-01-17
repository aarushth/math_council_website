/*
  Warnings:

  - You are about to drop the column `score_report` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "score_report",
ADD COLUMN     "scoreReport" BOOLEAN[];
