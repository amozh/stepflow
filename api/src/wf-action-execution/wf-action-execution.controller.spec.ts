import { Test, TestingModule } from '@nestjs/testing';
import { WfActionExecutionController } from './wf-action-execution.controller';

describe('WfActionExecution Controller', () => {
  let controller: WfActionExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfActionExecutionController],
    }).compile();

    controller = module.get<WfActionExecutionController>(WfActionExecutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
