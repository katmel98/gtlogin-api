import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService],
    }).compile();
    service = module.get<GroupsService>(GroupsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
