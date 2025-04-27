-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL;
