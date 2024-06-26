import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"

const authorization = {

    employee: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.EmployeeModel.findOne({
                _id: user.userId,
                role: "employee",
                isDeleted: false,
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },

    manager: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.UserModel.findOne({
                _id: user.userId,
                role: "manager",
                isDeleted: false,
                isVerified: true
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },

    admin: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.UserModel.findOne({
                _id: user.userId,
                role: "admin",
                isDeleted: false,
                isVerified: true
            })

            if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },

    managerOrAdmin: async (req, res, next) => {
        try {
            const user = req.user

            const currentUser = await ModelDb.UserModel.findOne({
                _id: user.userId,
                role: { $in: ["manager", "admin"] },
                isDeleted: false,
                isVerified: true
            })
            if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {
            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    }
}

export default authorization