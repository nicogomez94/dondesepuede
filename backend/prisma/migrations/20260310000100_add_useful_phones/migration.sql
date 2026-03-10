-- CreateTable
CREATE TABLE "useful_phones" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "color" TEXT DEFAULT '#ff6b35',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "useful_phones_pkey" PRIMARY KEY ("id")
);
