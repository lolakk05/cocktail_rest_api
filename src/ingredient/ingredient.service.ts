import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { DatabaseService } from '../database/database.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../pagination/utils/constants';

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

  findAll(paginationDto: PaginationDto) {
    return this.database.ingredient.findMany({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
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
