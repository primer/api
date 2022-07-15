/*
  Warnings:

  - You are about to drop the column `description` on the `ComponentImpl` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ComponentImpl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[componentName,framework]` on the table `ComponentImpl` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `ComponentImpl` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `framework` on the `ComponentImpl` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ComponentFrameworkEnum" AS ENUM ('REACT', 'RAILS', 'FIGMA');

-- CreateEnum
CREATE TYPE "ComponentImplStatusEnum" AS ENUM ('ALPHA', 'BETA', 'STABLE', 'DEPRECATED');

-- DropIndex
DROP INDEX "ComponentImpl_framework_name_key";

-- AlterTable
ALTER TABLE "ComponentImpl" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "status" "ComponentImplStatusEnum" NOT NULL,
DROP COLUMN "framework",
ADD COLUMN     "framework" "ComponentFrameworkEnum" NOT NULL;

-- DropEnum
DROP TYPE "ComponentFramework";

-- CreateIndex
CREATE UNIQUE INDEX "ComponentImpl_componentName_framework_key" ON "ComponentImpl"("componentName", "framework");
