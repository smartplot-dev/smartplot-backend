import { Test, TestingModule } from '@nestjs/testing';
import { AdminExpensesService } from './admin-expenses.service';

describe('AdminExpensesService', () => {
  let service: AdminExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminExpensesService],
    }).compile();

    service = module.get<AdminExpensesService>(AdminExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
