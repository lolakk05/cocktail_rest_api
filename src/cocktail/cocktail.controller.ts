import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CocktailFilterDto } from '../filters/cocktail-filter.dto';
import { AuthGuard, type RequestWithUser } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('cocktails')
@Controller('cocktails')
export class CocktailController {
  constructor(private readonly cocktailService: CocktailService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new cocktail',
    description: 'Creates single cocktail item',
  })
  @ApiCreatedResponse({
    description: 'Cocktail item created',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. missing value, wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @Body() createCocktailDto: CreateCocktailDto,
    @Req() req: RequestWithUser,
  ) {
    return this.cocktailService.create(createCocktailDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all the cocktails',
    description: 'Returns all the cocktails',
  })
  @ApiOkResponse({
    description: 'Cocktails succesfully found',
  })
  findAll(@Query() filterDto: CocktailFilterDto) {
    return this.cocktailService.findAll(filterDto);
  }

  @ApiOperation({
    summary: 'Get one cocktail with specified id',
    description: 'Get cocktail with id specified in path',
  })
  @ApiOkResponse({
    description: 'Cocktails with specified id succesfully found',
  })
  @ApiNotFoundResponse({
    description: 'Cocktail with specified id not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cocktailService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update data of cocktail',
    description: 'Update data of cocktail specified in path',
  })
  @ApiOkResponse({
    description: 'Cocktail succesfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Cocktail with specified id not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailService.update(+id, updateCocktailDto);
  }

  @ApiOperation({
    summary: 'Delete one cocktail',
    description: 'Delete data of cocktail specified in path',
  })
  @ApiOkResponse({
    description: 'Cocktail succesfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Cocktail not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.cocktailService.remove(+id, req.user);
  }
}
