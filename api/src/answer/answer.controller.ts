
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Param,
    ParseIntPipe,
  } from '@nestjs/common';

import {AnswerService} from "./answer.service";
import { Answer } from './answer.entity';
import { AnswerDto } from '@stepflow/shared';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

     @Post()
     checkAnswer(@Body() answer: AnswerDto): Promise<string> {
         return this.answerService.checkAnswer(answer)
     }
}
