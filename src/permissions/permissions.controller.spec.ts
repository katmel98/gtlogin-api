import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';

describe('Permissions Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PermissionsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PermissionsController = module.get<PermissionsController>(PermissionsController);
    expect(controller).toBeDefined();
  });
});
