ALTER TABLE "businesses"
ADD COLUMN "regular_price" DECIMAL(12, 2),
ADD COLUMN "sale_price" DECIMAL(12, 2),
ADD COLUMN "expires_at" TIMESTAMP(3);
