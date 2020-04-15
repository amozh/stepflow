import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';

//modules
import { WorkflowModule } from './workflow/workflow.module';
import { WfStepModule } from './wf-step/wf-step.module';
import { UserModule } from './user/user.module';
import { UserGroupModule } from './user-group/user-group.module';
import { ActionModule } from './action/action.module';
import { WfExecutionsModule } from './wf-executions/wf-executions.module';
import { WfStepExecutionModule } from './wf-step-execution/wf-step-execution.module';
import { WfActionExecutionModule } from './wf-action-execution/wf-action-execution.module';
import { WfStepActionExecutionModule } from './wf-step-action-execution/wf-step-action-execution.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        WorkflowModule,
        WfStepModule,
        UserModule,
        UserGroupModule,
        ActionModule,
        WfExecutionsModule,
        WfStepExecutionModule,
        WfActionExecutionModule,
        WfStepActionExecutionModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
