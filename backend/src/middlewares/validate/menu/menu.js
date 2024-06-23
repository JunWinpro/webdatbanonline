import menuValidate from "../../../validateSchema/menu.validate.js";

const menuValidateData = {
    createMenu: (req, res, next) => {
        try {
            const { error, value } = menuValidate.create.validate(req.body)
            if (error) throw new (Error(error.details[0].message))
            req.body = value
            next()
        } catch (error) {
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    }
}

export default menuValidateData