import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {Answer} from "./answer.entity"
import { AnswerDto } from '@stepflow/shared';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
      ) {}

      async checkAnswer(answerDto:AnswerDto){
          const {parent, answer} = answerDto
          try {
            console.log(parent, answer)
            const foundAnswer = await this.answerRepository.findOne({id:+parent})
            if(foundAnswer.answer== answer){
                return "Correct answer"
            }
            else{
                return "Wrong answer"
            }
          } catch (e) {
            throw new InternalServerErrorException();
          }
      }
}
