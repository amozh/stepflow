import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';

//modules
import { AnswerModule } from './answer/answer.module';
import { WorkflowModule } from './workflow/workflow.module';
import { WfStepModule } from './wf-step/wf-step.module';

@Module({
    imports: [TypeOrmModule.forRoot(), WorkflowModule, WfStepModule, AnswerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
