import { Test, TestingModule } from '@nestjs/testing';
import { VersionApiController } from './version-api.controller';

describe('VersionApiController', () => {
  let controller: VersionApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionApiController],
    }).compile();

    controller = module.get<VersionApiController>(VersionApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
