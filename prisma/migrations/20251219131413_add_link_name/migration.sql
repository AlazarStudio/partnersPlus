/*
  Warnings:

  - The `attachments` column on the `Organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `link` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `condition` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "linkName" TEXT,
ALTER COLUMN "link" SET NOT NULL,
ALTER COLUMN "condition" SET NOT NULL,
DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB;
