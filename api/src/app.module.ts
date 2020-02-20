import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';

//modules
import { AnswerModule } from './answer/answer.module';
import { WorkflowModule } from './workflow/workflow.module';
import { WfStepModule } from './wf-step/wf-step.module';
import { UserModule } from './user/user.module';
import { UserGroupModule } from './user-group/user-group.module';
import { FilesModule } from './files/files.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        WorkflowModule,
        WfStepModule,
        AnswerModule,
        UserModule,
        UserGroupModule,
        FilesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
