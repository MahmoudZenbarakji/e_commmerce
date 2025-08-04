import { Test, TestingModule } from '@nestjs/testing';
import { SubcategryController } from './subcategry.controller';
import { SubcategryService } from './subcategry.service';

describe('SubcategryController', () => {
  let controller: SubcategryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategryController],
      providers: [SubcategryService],
    }).compile();

    controller = module.get<SubcategryController>(SubcategryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
