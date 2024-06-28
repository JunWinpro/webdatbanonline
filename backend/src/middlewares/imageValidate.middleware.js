import returnError from "../errors/error.js"

const imageValidate = (req, res, next) => {
    try {
        const files = req.files
        const file = req.file

        if (file) {
            if (!file.mimetype.includes("image")) throw new Error("Invalid image file")
        }

        if (files) {
            let i = 0
            while (Object.keys(files)[i]) {
                let key = Object.keys(files)[i]
                for (let file of files[key]) {
                    if (!file.mimetype.includes("image")) throw new Error(`Invalid image at: ${key} - index ${i}`)
                }
                i++;
            }
        }

        next()
    } catch (error) {
        returnError(res, 403, error)
    }

}
export default imageValidate