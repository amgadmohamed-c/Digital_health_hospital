// multer.ts (new file)
import multer from "multer";

export const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./upload")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + Date.now())
    }
})

export const upload = multer({ storage: storage })