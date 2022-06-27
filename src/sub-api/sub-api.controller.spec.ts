import { Test, TestingModule } from '@nestjs/testing';
import { SubApiController } from './sub-api.controller';

describe('ApiControllerController', () => {
  let controller: SubApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubApiController],
    }).compile();

    controller = module.get<SubApiController>(SubApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
