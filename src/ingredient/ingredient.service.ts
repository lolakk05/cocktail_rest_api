import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { DatabaseService } from '../database/database.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../pagination/utils/constants';
import { IngredientFilterDto } from '../filters/ingredient-filter.dto';

@Injectable()
export class IngredientService {
  constructor(private database: DatabaseService) {}

  create(createIngredientDto: CreateIngredientDto) {
    return this.database.ingredient.create({
      data: {
        ...createIngredientDto,
      },
    });
  }

  findAll(filters: IngredientFilterDto) {
    const { page = 1, limit = DEFAULT_PAGE_SIZE } = filters;
    return this.database.ingredient.findMany({
      skip: (page - 1) * limit,
      take: filters.limit ?? DEFAULT_PAGE_SIZE,
      where: {
        ...(filters.name && {
          name: { contains: filters.name, mode: 'insensitive' },
        }),
        ...(filters.isAlcoholic && { isAlcoholic: filters.isAlcoholic }),
      },
    });
  }

  findOne(id: number) {
    return this.database.ingredient.findUnique({
      where: {
        ingredientId: id,
      },
    });
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return this.database.ingredient.update({
      where: {
        ingredientId: id,
      },
      data: {
        ...updateIngredientDto,
      },
    });
  }

  remove(id: number) {
    return this.database.ingredient.delete({
      where: {
        ingredientId: id,
      },
    });
  }
}
