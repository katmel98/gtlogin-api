import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';

describe('Groups Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [GroupsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: GroupsController = module.get<GroupsController>(GroupsController);
    expect(controller).toBeDefined();
  });
});
