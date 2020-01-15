import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkflowModule } from './workflow/workflow.module';
import { WfStepModule } from './wf-step/wf-step.module';

@Module({
    imports: [TypeOrmModule.forRoot(), WorkflowModule, WfStepModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
