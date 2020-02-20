// import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { FilesEntity } from './files.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
    constructor(@InjectRepository(FilesEntity) private readonly fileRepo: Repository<FilesEntity>) { }

    async dbSave(
        file: Express.Multer.File,
        newFileName: string
    ): Promise<FilesEntity> {
        return this.fileRepo.save({
            originalName: newFileName,
            size: file.size,
            currentName: newFileName,
        })

    }
}
