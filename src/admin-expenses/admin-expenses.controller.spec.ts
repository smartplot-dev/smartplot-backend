import { Test, TestingModule } from '@nestjs/testing';
import { AdminExpensesController } from './admin-expenses.controller';

describe('AdminExpensesController', () => {
  let controller: AdminExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminExpensesController],
    }).compile();

    controller = module.get<AdminExpensesController>(AdminExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
