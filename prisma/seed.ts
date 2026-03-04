import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedDatabase() {
  console.log("Seeding database...");
  const user = await prisma.user.create({
    data: {
      login: "john",
      email: "john@gmail.com",
      password: "hashedpassword",
    },
  });

  const mojito = await prisma.cocktail.create({
    data: {
      name: "Mojito",
      category: "ALCOHOLIC",
      recipe:
        "Wciśnij limonkę, dodaj cukier, miętę, lód, zalej rumem i wodą gazowaną.",
      createdBy: user.userId,
      ratios: {
        create: [
          {
            amount: 50,
            unit: "ML",
            ingredient: {
              create: {
                name: "Biały Rum",
                description: "Tradycyjny alkohol z trzciny cukrowej.",
                isAlcoholic: true,
              },
            },
          },
          {
            amount: 0.5,
            unit: "PIECE",
            ingredient: {
              create: {
                name: "Limonka",
                description: "Świeży owoc cytrusowy.",
                isAlcoholic: false,
              },
            },
          },
        ],
      },
    },
  });
}
