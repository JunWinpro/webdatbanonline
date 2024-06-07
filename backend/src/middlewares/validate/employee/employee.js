import employeeValidate from "../../../validateSchema/employee.validate.js"

const employeeValidateData = {
    register: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.register.validate(req.body)
            if (error) throw new Error(error.details[0].message)
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

            if (req.body.username) {
                req.username = req.body.username
            } else if (req.body.phone) {
                req.phone = req.body.phone
            }

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
            const file = req.file

            if (file && file.length === 0) throw new Error("File not found")

            const { error, value } = employeeValidate.update.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            const { password, newPassword } = req.body

            if (password && !newPassword) throw new Error("Please provide your new password")
            else if (!password && newPassword) throw new Error("Please provide your current password")
            else if (password && newPassword) {
                if (password === newPassword) throw new Error("New password must be different from old password")
            }

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
    forgetPassword: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.forgetPassword.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },
    resetPassword: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.resetPassword.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },
    changeRole: (req, res, next) => {
        try {
            const { error, value } = employeeValidate.changeRole.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            next()
        }
        catch (err) {
            console.log("change role user err: ", err)

            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    }
}
export default employeeValidateData