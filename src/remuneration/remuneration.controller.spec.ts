import { Test, TestingModule } from '@nestjs/testing';
import { RemunerationController } from './remuneration.controller';

describe('RemunerationController', () => {
  let controller: RemunerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemunerationController],
    }).compile();

    controller = module.get<RemunerationController>(RemunerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
