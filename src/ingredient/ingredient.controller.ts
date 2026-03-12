import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new ingredient',
    description: 'Creates single ingredient',
  })
  @ApiCreatedResponse({
    description: 'Ingredient succesfuly created',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. missing value, wrong type)',
  })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }
  @ApiOperation({
    summary: 'Get all the ingredients',
    description: 'Returns all the ingredients',
  })
  @ApiOkResponse({
    description: 'Ingredients succesfully found',
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ingredientService.findAll(paginationDto);
  }

  @ApiOperation({
    summary: 'Get one ingredient with specified id',
    description: 'Get ingredient with id specified in path',
  })
  @ApiOkResponse({
    description: 'Ingredient succesfully found',
  })
  @ApiNotFoundResponse({
    description: 'Ingredient not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(+id);
  }
  @ApiOperation({
    summary: 'Update data of ingredient',
    description: 'Update data of ingredient specified in path',
  })
  @ApiOkResponse({
    description: 'Ingredient succesfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Ingredient not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @ApiOperation({
    summary: 'Delete one ingredient',
    description: 'Delete data of ingredient specified in path',
  })
  @ApiOkResponse({
    description: 'Ingredient succesfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Ingredient not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientService.remove(+id);
  }
}
