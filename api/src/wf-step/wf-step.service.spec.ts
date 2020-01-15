import { Test, TestingModule } from '@nestjs/testing';
import { WfStepService } from './wf-step.service';

describe('WfStepService', () => {
  let service: WfStepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WfStepService],
    }).compile();

    service = module.get<WfStepService>(WfStepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
