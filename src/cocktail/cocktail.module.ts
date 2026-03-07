import { Module } from '@nestjs/common';
import { CocktailService } from './cocktail.service';
import { CocktailController } from './cocktail.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [CocktailController],
  providers: [CocktailService],
  imports: [DatabaseModule],
})
export class CocktailModule {}
