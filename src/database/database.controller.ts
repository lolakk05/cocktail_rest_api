import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CocktailModel } from '../../generated/prisma/models/Cocktail';

@Controller('database')
export class DatabaseController {
  constructor(private prisma: DatabaseService) {}

  @Get('/')
  async testRead(): Promise<CocktailModel[]> {
    return await this.prisma.cocktail.findMany({
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }
}
