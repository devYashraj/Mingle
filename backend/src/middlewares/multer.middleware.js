import multer from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, `${randomUUID()}${path.extname(file.originalname)}`)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 5242880, files: 5 }
})