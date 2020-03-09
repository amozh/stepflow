import { Test, TestingModule } from '@nestjs/testing';
import { WfStepActionExecutionService } from './wf-step-action-execution.service';

describe('WfStepActionExecutionService', () => {
  let service: WfStepActionExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfStepActionExecutionService],
    }).compile();

    service = module.get<WfStepActionExecutionService>(WfStepActionExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
