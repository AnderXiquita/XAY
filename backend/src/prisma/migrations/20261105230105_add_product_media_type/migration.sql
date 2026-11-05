-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "media_type" "MediaType" NOT NULL DEFAULT 'image',
ADD COLUMN     "poster_url" TEXT,
ADD COLUMN     "public_id" TEXT;

-- CreateIndex
CREATE INDEX "product_images_product_id_position_idx" ON "product_images"("product_id", "position");
