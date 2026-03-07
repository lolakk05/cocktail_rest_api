import { Injectable } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CocktailService {
  constructor(private database: DatabaseService) {}

  create(createCocktailDto: CreateCocktailDto) {
    return this.database.cocktail.create({
      data: {
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        recipe: createCocktailDto.recipe,

        ratios: {
          create: createCocktailDto.ratios.map((ratio) => ({
            amount: ratio.amount,
            unit: ratio.unit,
            ingredient: {
              connect: { ingredientId: ratio.ingredientId },
            },
          })),
        },
      },
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.database.cocktail.findMany({
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.database.cocktail.findUnique({
      where: {
        cocktailId: id,
      },
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  update(id: number, updateCocktailDto: UpdateCocktailDto) {
    return this.database.cocktail.update({
      where: {
        cocktailId: id,
      },
      data: {
        name: updateCocktailDto.name,
        category: updateCocktailDto.category,
        recipe: updateCocktailDto.recipe,
        ...(updateCocktailDto.ratios && {
          ratios: {
            create: updateCocktailDto.ratios.map((ratio) => ({
              amount: ratio.amount,
              unit: ratio.unit,
              ingredient: {
                connect: { ingredientId: ratio.ingredientId },
              },
            })),
          },
        }),
      },
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} cocktail`;
  }
}
