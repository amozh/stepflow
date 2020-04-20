import { ActionService } from './action.service';
import { Controller, Post, Body } from '@nestjs/common';
import { IActionDto, IActionExecutionBodyDto } from '@stepflow/shared';

@Controller('action')
export class ActionController {
    // constructor(private readonly actionService: ActionService) { }

    // @Post("new_action")
    // createAction(@Body() actionDto: IActionDto): Promise<IActionDto> {
    //     return this.actionService.createAction(actionDto)
    // }

    // @Post("execute")
    // executeAction(@Body() body: IActionExecutionBodyDto): Promise<any> {
    //     return this.actionService.executeAction(body)
    // }
}
