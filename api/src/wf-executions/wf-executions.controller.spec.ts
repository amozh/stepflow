import { Test, TestingModule } from '@nestjs/testing';
import { WfExecutionsController } from './wf-executions.controller';

describe('WfExecutions Controller', () => {
  let controller: WfExecutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfExecutionsController],
    }).compile();

    controller = module.get<WfExecutionsController>(WfExecutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
