/*
  Warnings:

  - Added the required column `updated_at` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TypeOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TypeOrganization" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
