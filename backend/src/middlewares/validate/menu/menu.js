import returnError from "../../../errors/error.js";
import menuValidate from "../../../validateSchema/menu/menu.validate.js";

const menuValidateData = {
    createMenu: (req, res, next) => {
        try {
            const { error, value } = menuValidate.createMenu.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        } catch (err) {
            returnError(res, 403, err)
        }
    },

    updateMenu: (req, res, next) => {
        try {
            const { error, value } = menuValidate.updateMenu.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        } catch (err) {
            returnError(res, 403, err)
        }
    },
    uploadMenuImage: (req, res, next) => {
        try {
            const { error, value } = menuValidate.uploadMenuImage.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default menuValidateData