
import { v4 } from "uuid"
import { diskStorage } from "multer"

export const multer = diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb) =>
        cb(null, "public/uploads"),
    filename: (req: Express.Request, file: Express.Multer.File, cb) => {
        const [, ext] = file.mimetype.split('/')
        const filename = `${v4()}.${ext}`
        cb(null,
            filename
        )
    }
})