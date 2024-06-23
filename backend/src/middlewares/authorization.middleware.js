import ModelDb from "../models/model.js"

const authorization = {

    employee: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.EmployeeModel.findOne({
                _id: user.userId,
                role: "employee",
                isDeleted: false
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            req.authorizedUser = currentUser

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },

    manager: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.UserModel.findOne({
                _id: user.userId,
                role: "manager",
                isDeleted: false
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            req.authorizedUser = currentUser

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    },

    admin: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.UserModel.findOne({
                _id: user.userId,
                role: "admin",
                isDeleted: false,
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            req.authorizedUser = currentUser

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            res.status(403).json({
                data: null,
                err,
                message: err.message,
                success: false,
            })
        }
    }

}

export default authorization