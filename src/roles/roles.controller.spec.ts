import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';

describe('Roles Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RolesController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RolesController = module.get<RolesController>(RolesController);
    expect(controller).toBeDefined();
  });
});
