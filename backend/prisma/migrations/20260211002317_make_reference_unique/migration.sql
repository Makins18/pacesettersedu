/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");
