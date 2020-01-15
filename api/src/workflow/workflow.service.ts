import { Injectable, OnModuleInit } from '@nestjs/common';
import { Workflow } from "./workflow.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateWorkflowDto } from "@stepflow/shared";

@Injectable()
export class WorkflowService implements OnModuleInit {
  constructor(
    @InjectRepository(Workflow) private readonly workflowRepository: Repository<Workflow>,
  ) {}

  onModuleInit() {
    //generate default data
    this.workflowRepository.save({
      name: "Basic Workflow 1",
      description: "",
      steps: [
        {
          name: "Basic Step 1",
          description: ""
        }
      ]
    })
  }

  create(wf: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowRepository.save(wf);
  }

  findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find();
  }
}
