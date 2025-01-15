import multer from 'multer';

const storage = multer.diskStorage({
    diskStorage: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 5242880, files: 5 }
})