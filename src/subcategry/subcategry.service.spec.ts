import { Test, TestingModule } from '@nestjs/testing';
import { SubcategryService } from './subcategry.service';

describe('SubcategryService', () => {
  let service: SubcategryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubcategryService],
    }).compile();

    service = module.get<SubcategryService>(SubcategryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
