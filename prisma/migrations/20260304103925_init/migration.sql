-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ALCOHOLIC', 'NON_ALCOHOLIC');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('ML', 'G', 'PIECE', 'TEASPOON');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "cocktail" (
    "cocktail_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "recipe" TEXT NOT NULL,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cocktail_pkey" PRIMARY KEY ("cocktail_id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "ingredient_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_alcoholic" BOOLEAN NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "ratio" (
    "ratio_id" SERIAL NOT NULL,
    "cocktail_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "unit" "Unit" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratio_pkey" PRIMARY KEY ("ratio_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ratio_cocktail_id_ingredient_id_key" ON "ratio"("cocktail_id", "ingredient_id");

-- AddForeignKey
ALTER TABLE "cocktail" ADD CONSTRAINT "cocktail_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratio" ADD CONSTRAINT "ratio_cocktail_id_fkey" FOREIGN KEY ("cocktail_id") REFERENCES "cocktail"("cocktail_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratio" ADD CONSTRAINT "ratio_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;
