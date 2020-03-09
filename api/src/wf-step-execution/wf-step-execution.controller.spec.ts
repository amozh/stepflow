import { Test, TestingModule } from '@nestjs/testing';
import { WfStepExecutionController } from './wf-step-execution.controller';

describe('WfStepExecution Controller', () => {
  let controller: WfStepExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfStepExecutionController],
    }).compile();

    controller = module.get<WfStepExecutionController>(WfStepExecutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
