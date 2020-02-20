


import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, Param } from '@nestjs/common';
import { FilesService } from "./files.service"
import { FileInterceptor } from "@nestjs/platform-express"

import { FilesEntity } from "./files.entity"
import { multer } from './../multer/multer';


@Controller('files')
export class FilesController {

    constructor(public service: FilesService) { }

    @Post("upload")
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FilesEntity> {
        return this.service.dbSave(
            file,
            file.filename
        )
    }
    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: 'public/uploads' })
    }
}
//