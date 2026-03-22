import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { DatabaseService } from '../database/database.service';
import { DEFAULT_PAGE_SIZE } from '../pagination/utils/constants';
import { CocktailFilterDto } from '../filters/cocktail-filter.dto';
import { JwtPayload, RequestWithUser } from '../auth/auth.guard';

@Injectable()
export class CocktailService {
  constructor(private database: DatabaseService) {}

  async create(createCocktailDto: CreateCocktailDto, userId: number) {
    return await this.database.cocktail.create({
      data: {
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        recipe: createCocktailDto.recipe,
        createdBy: userId,
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

  findAll(filters: CocktailFilterDto) {
    const { page = 1, limit = DEFAULT_PAGE_SIZE } = filters;
    return this.database.cocktail.findMany({
      skip: (page - 1) * limit,
      take: filters.limit ?? DEFAULT_PAGE_SIZE,
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.name && {
          name: { contains: filters.name, mode: 'insensitive' },
        }),

        ...(filters.ingredientName && {
          ratios: {
            some: {
              ingredient: {
                name: {
                  contains: filters.ingredientName,
                  mode: 'insensitive',
                },
              },
            },
          },
        }),
      },
      orderBy: {
        [filters.orderBy as string]: filters.order,
      },
      include: {
        ratios: {
          include: {
            ingredient: true,
          },
        },
        user: {
          select: {
            login: true,
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
        user: {
          select: {
            login: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateCocktailDto: UpdateCocktailDto,
    user: JwtPayload,
  ) {
    const cocktail = await this.database.cocktail.findUnique({
      where: {
        cocktailId: id,
      },
    });

    if (!cocktail) {
      throw new NotFoundException('No cocktail with this id');
    }

    const isAdmin = user.role === 'ADMIN';
    const isOwner = cocktail.createdBy === user.id;

    if (!isAdmin && !isOwner) {
      throw new UnauthorizedException('U can update only your own cocktails');
    }

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

  async remove(id: number, user: JwtPayload) {
    const cocktail = await this.database.cocktail.findUnique({
      where: {
        cocktailId: id,
      },
    });

    if (!cocktail) {
      throw new NotFoundException('No cocktail with this id');
    }

    const isAdmin = user.role === 'ADMIN';
    const isOwner = cocktail.createdBy === user.id;

    if (!isAdmin && !isOwner) {
      throw new UnauthorizedException('U can delete only your own cocktails');
    }

    return this.database.cocktail.delete({
      where: {
        cocktailId: id,
      },
    });
  }
}
