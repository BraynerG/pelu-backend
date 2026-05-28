-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'hair',
ADD COLUMN     "steps" TEXT[];

-- CreateTable
CREATE TABLE "LookbookSlide" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "accent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LookbookSlide_pkey" PRIMARY KEY ("id")
);
