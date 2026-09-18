-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "heroLocation" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "mapUrl" TEXT,
ADD COLUMN     "siteName" TEXT NOT NULL DEFAULT 'La tua struttura',
ADD COLUMN     "siteTagline" TEXT DEFAULT 'Guida Ospiti',
ADD COLUMN     "websiteUrl" TEXT;
