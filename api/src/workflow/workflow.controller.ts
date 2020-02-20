
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow.entity';
import { CreateWorkflowDto } from '@stepflow/shared';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) { }

  @Get()
  getAll(): Promise<Workflow[]> {
    return this.workflowService.findAll();
  }

  @Post()
  create(@Body() workflow: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowService.create(workflow);
  }

  @Get('/:id')
  getWorkflowById(@Param('id', ParseIntPipe) id: number): Promise<Workflow> {
    return this.workflowService.findById(id);
  }

  @Post('answer')
  giveAnswer(
    @Body()
    @Query("workflow", ParseIntPipe) workflow: number,
    @Query("step", ParseIntPipe) step: number)
    : void {
    return console.log("workflowNumber:", workflow, "stepNumber:", step)
  }

  // @Post("upload")
  //   @UseInterceptors(
  //       FileInterceptor('file', {
  //           storage: multer, //Если не будет работать, смотри вниз
  //       }),
  //   )
  //   uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FilesEntity> {
  //       console.log(file.filename, "chto tut?")
  //       return this.service.dbSave(
  //           file,
  //           file.filename
  //           // FilesController.genericService.pcoket.filename
  //       )
  //   }
}
