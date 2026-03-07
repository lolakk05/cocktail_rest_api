import { Test, TestingModule } from '@nestjs/testing';
import { CocktailService } from './cocktail.service';

describe('CocktailService', () => {
  let service: CocktailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CocktailService],
    }).compile();

    service = module.get<CocktailService>(CocktailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
