import { Test, TestingModule } from '@nestjs/testing';
import { MeterReadingController } from './meter-reading.controller';

describe('MeterReadingController', () => {
  let controller: MeterReadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeterReadingController],
    }).compile();

    controller = module.get<MeterReadingController>(MeterReadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
