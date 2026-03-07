import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { DatabaseService } from '../database/database.service';

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

  findAll() {
    return this.database.ingredient.findMany();
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
