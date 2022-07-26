-- CreateEnum
CREATE TYPE "ComponentFramework" AS ENUM ('REACT', 'RAILS', 'FIGMA');

-- CreateTable
CREATE TABLE "ComponentImpl" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "framework" "ComponentFramework" NOT NULL,
    "source" TEXT,
    "componentId" TEXT NOT NULL,

    CONSTRAINT "ComponentImpl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComponentImpl" ADD CONSTRAINT "ComponentImpl_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
