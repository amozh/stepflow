
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';

import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Answer } from "./answer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  controllers: [AnswerController],
  providers: [AnswerService]
})
export class AnswerModule { }
