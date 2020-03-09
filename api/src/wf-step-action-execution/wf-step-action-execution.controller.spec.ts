import { Test, TestingModule } from '@nestjs/testing';
import { WfStepActionExecutionController } from './wf-step-action-execution.controller';

describe('WfStepActionExecution Controller', () => {
  let controller: WfStepActionExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfStepActionExecutionController],
    }).compile();

    controller = module.get<WfStepActionExecutionController>(WfStepActionExecutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
