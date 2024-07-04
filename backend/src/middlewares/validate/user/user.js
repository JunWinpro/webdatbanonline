import returnError from "../../../errors/error.js"
import userValidate from "../../../validateSchema/user/user.validate.js"

const userValidateData = {
    register: (req, res, next) => {
        try {
            const { error, value } = userValidate.register.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate register err: ", err)
            returnError(res, 403, err)
        }
    },
    login: (req, res, next) => {
        try {
            const { error, value } = userValidate.login.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate login err: ", err)
            returnError(res, 403, err)
        }

    },
    update: (req, res, next) => {
        try {
            const { password } = req.body

            if (!password) throw new Error("Please enter your password")

            const { error, value } = userValidate.update.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate update user err: ", err)
            returnError(res, 403, err)
        }
    },
    forgetPassword: (req, res, next) => {
        try {
            const { error, value } = userValidate.forgetPassword.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        }
        catch (err) {
            console.log("change role user err: ", err)
            returnError(res, 403, err)
        }
    },
    resetPassword: (req, res, next) => {
        try {

            const { error, value } = userValidate.resetPassword.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)
            returnError(res, 403, err)
        }
    },
    changeRole: (req, res, next) => {
        try {
            const { error, value } = userValidate.changeRole.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)
            returnError(res, 403, err)
        }
    },
    deleteUser: (req, res, next) => {
        try {
            const { error, value } = userValidate.deleteUser.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)
            returnError(res, 403, err)
        }
    }
}
export default userValidateData