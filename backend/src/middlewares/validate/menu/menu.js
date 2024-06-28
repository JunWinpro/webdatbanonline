import returnError from "../../../errors/error.js";
import menuValidate from "../../../validateSchema/menu.validate.js";

const menuValidateData = {
    createMenu: (req, res, next) => {
        try {
            const { error, value } = menuValidate.createMenu.validate(req.body)
            console.log(error?.details[0].type)
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
    }
}

export default menuValidateData