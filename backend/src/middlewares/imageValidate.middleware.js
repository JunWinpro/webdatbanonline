import returnError from "../errors/error.js"

const imageValidate = {
    file: (req, res, next) => {
        try {
            const file = req.file
            if (!file) throw new Error("File not found")
            if (!file.mimetype.includes("image")) throw new Error("Invalid image file")

            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    files: (req, res, next) => {
        try {
            const files = req.files
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].mimetype.includes("image")) throw new Error(`Invalid image at index ${i}`)
                }
            }
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    fields: (req, res, next) => {
        try {
            const files = req.files
            if (files && files.length > 0) {
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
        }
        catch (err) {
            returnError(res, 403, err)
        }

    }

}
export default imageValidate