import { Test, TestingModule } from '@nestjs/testing';
import { SyslogsController } from './syslogs.controller';

describe('Syslogs Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SyslogsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SyslogsController = module.get<SyslogsController>(SyslogsController);
    expect(controller).toBeDefined();
  });
});
