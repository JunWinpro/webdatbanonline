import mongoose from "mongoose"
import returnError from "../../../errors/error.js"
const objectIdValidate = (req, res, next) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ObjectId")
        next()
    } catch (err) {
        returnError(res, 403, err)
    }
}

export default objectIdValidate