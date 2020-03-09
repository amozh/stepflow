import { Test, TestingModule } from '@nestjs/testing';
import { WfExecutionsService } from './wf-executions.service';

describe('WfExecutionsService', () => {
  let service: WfExecutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfExecutionsService],
    }).compile();

    service = module.get<WfExecutionsService>(WfExecutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
