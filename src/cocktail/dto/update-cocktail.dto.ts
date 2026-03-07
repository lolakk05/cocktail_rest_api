import { PartialType } from '@nestjs/mapped-types';
import { CreateCocktailDto } from './create-cocktail.dto';

export class UpdateCocktailDto extends PartialType(CreateCocktailDto) {}
