import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WorkflowStep } from "./wf-step.entity";

@Injectable()
export class WfStepService {
  constructor(
    @InjectRepository(WorkflowStep) private readonly wfStepRepository: Repository<WorkflowStep>,
  ) {}
}
