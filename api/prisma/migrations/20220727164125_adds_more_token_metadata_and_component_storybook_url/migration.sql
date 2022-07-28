-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('COLOR', 'DIMENSION', 'DURATION', 'TYPOGRAPHY');

-- AlterTable
ALTER TABLE "ComponentImpl" ADD COLUMN     "componentBookUrl" TEXT;

-- AlterTable
ALTER TABLE "DesignToken" ADD COLUMN     "rawValue" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'COLOR';
