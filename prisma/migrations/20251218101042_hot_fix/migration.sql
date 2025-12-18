-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_typeOrganizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "link" DROP NOT NULL,
ALTER COLUMN "condition" DROP NOT NULL,
ALTER COLUMN "typeOrganizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_typeOrganizationId_fkey" FOREIGN KEY ("typeOrganizationId") REFERENCES "TypeOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
