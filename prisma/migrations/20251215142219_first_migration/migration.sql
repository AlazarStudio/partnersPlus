-- CreateTable
CREATE TABLE "TypeOrganization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "attachments" TEXT[],
    "avatar" TEXT NOT NULL,
    "typeOrganizationId" INTEGER NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_typeOrganizationId_key" ON "Organization"("typeOrganizationId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_typeOrganizationId_fkey" FOREIGN KEY ("typeOrganizationId") REFERENCES "TypeOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
