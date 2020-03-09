import { ActionService } from './action.service';
import { Controller, Get } from '@nestjs/common';

@Controller('action')
export class ActionController {
    constructor(private readonly actionService: ActionService) { }

    @Get()
    getAction(): string {
        return this.actionService.getAction()
    }
}
