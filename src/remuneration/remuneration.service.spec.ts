import { Test, TestingModule } from '@nestjs/testing';
import { RemunerationService } from './remuneration.service';

describe('RemunerationService', () => {
  let service: RemunerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemunerationService],
    }).compile();

    service = module.get<RemunerationService>(RemunerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
