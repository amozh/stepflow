import { Test, TestingModule } from '@nestjs/testing';
import { WfStepExecutionService } from './wf-step-execution.service';

describe('WfStepExecutionService', () => {
  let service: WfStepExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfStepExecutionService],
    }).compile();

    service = module.get<WfStepExecutionService>(WfStepExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
