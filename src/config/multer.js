import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "storage/photos")
    },
    filename:(req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${crypto.randomUUID()}.${Date.now()}.${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("Invalid image type, upload png or jpeg formats"), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

export default upload;



