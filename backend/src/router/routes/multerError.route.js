import returnError from "../../errors/error.js";

const multerError = (err, _, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            err.message = "Too many files uploaded"
            returnError(res, 400, err)
        } else {
            returnError(res, 500, err)
        }
    } else {
        next(err);
    }
}

export default multerError;