import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionEntity } from './action.entity';

@Injectable()
export class ActionService {
    constructor(
        @InjectRepository(ActionEntity)
        private readonly actionRepository: Repository<ActionEntity>,
    ) { }

    getAction(): string {
        return "Action!"
    }
}
