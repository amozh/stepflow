import { Test, TestingModule } from '@nestjs/testing';
import { WfStepController } from './wf-step.controller';

describe('WfStep Controller', () => {
  let controller: WfStepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WfStepController],
    }).compile();

    controller = module.get<WfStepController>(WfStepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
