/*
  Warnings:

  - You are about to drop the column `componentId` on the `ComponentImpl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[framework,name]` on the table `ComponentImpl` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `componentName` to the `ComponentImpl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ComponentImpl" DROP CONSTRAINT "ComponentImpl_componentId_fkey";

-- AlterTable
ALTER TABLE "ComponentImpl" DROP COLUMN "componentId",
ADD COLUMN     "componentName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ComponentImpl_framework_name_key" ON "ComponentImpl"("framework", "name");

-- AddForeignKey
ALTER TABLE "ComponentImpl" ADD CONSTRAINT "ComponentImpl_componentName_fkey" FOREIGN KEY ("componentName") REFERENCES "Component"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
