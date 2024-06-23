import employeeValidate from "../../../validateSchema/employee.validate.js"

const employeeValidateData = {
    register: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.register.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate register err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },
    login: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.login.validate(req.body)

            if (error) throw new Error(error.details[0].message)

            let loginMethod;
            if (req.body.username) {
                loginMethod = req.body.username
            } else if (req.body.phone) {
                loginMethod = req.body.phone
            }
            req.loginMethod = loginMethod
            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate login err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }

    },
    update: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.update.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            const { password, newPassword } = req.body

            if (password && !newPassword) throw new Error("Please provide your new password")
            else if (!password && newPassword) throw new Error("Please provide your current password")
            else if (password && newPassword) {
                if (password === newPassword) throw new Error("New password must be different from old password")
            }
            req.body = value
            next()
        }
        catch (err) {
            console.log("Validate update user err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },
}
export default employeeValidateData