import returnError from "../../../errors/error.js"
import employeeValidate from "../../../validateSchema/employee/employee.validate.js"

const employeeValidateData = {
    register: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.register.validate(req.body)
            console.log(error?.details[0].type)
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
            const { error, value } = employeeValidate.login.validate(req.body)

            if (error) throw new Error(error.details[0].message)

            if (req.body.username) {
                req.loginMethod = req.body.username
            } else if (req.body.phone) {
                req.loginMethod = req.body.phone
            }

            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate login err: ", err)
            returnError(res, 403, err)
        }

    },
    updatePassword: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.updatePassword.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate update user err: ", err)
            returnError(res, 403, err)
        }
    },
    updateInfo: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.updateInfo.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate update user err: ", err)
            returnError(res, 403, err)
        }
    }
}
export default employeeValidateData