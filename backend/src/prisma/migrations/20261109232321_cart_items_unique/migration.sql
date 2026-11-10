-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_user_id_product_id_key" ON "cart_items"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_session_id_product_id_key" ON "cart_items"("session_id", "product_id");

