import { Test, TestingModule } from '@nestjs/testing';
import { CocktailController } from './cocktail.controller';
import { CocktailService } from './cocktail.service';

describe('CocktailController', () => {
  let controller: CocktailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CocktailController],
      providers: [CocktailService],
    }).compile();

    controller = module.get<CocktailController>(CocktailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
