-- DropIndex
DROP INDEX "Organization_typeOrganizationId_key";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL;
