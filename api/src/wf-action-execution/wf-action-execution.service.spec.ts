import { Test, TestingModule } from '@nestjs/testing';
import { WfActionExecutionService } from './wf-action-execution.service';

describe('WfActionExecutionService', () => {
  let service: WfActionExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfActionExecutionService],
    }).compile();

    service = module.get<WfActionExecutionService>(WfActionExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
