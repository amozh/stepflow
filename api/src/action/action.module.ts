import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ActionEntity } from "./action.entity"
// import { ActionController } from "./action.controller"
import { ActionService } from "./action.service"

@Module({
    imports: [TypeOrmModule.forFeature([ActionEntity])],
    // controllers: [ActionController],
    providers: [ActionService]
})
export class ActionModule { }
