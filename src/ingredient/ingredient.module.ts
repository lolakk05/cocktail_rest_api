import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
  imports: [DatabaseModule],
})
export class IngredientModule {}
