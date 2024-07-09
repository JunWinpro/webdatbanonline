import returnError from "../errors/error.js"

const role = {
    user: process.env.user,
    employee: process.env.employee,
    admin: process.env.admin,
    manager: process.env.manager
}

const authorization = {
    user: async (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.user) throw new Error("You don't have permission for this action")
            // const currentUser = await ModelDb.UserModel.findOne({
            //     _id: user.userId,
            //     role: "user",
            //     isDeleted: false,
            //     isVerified: true
            // })

            // if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    employee: async (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.employee) throw new Error("You don't have permission for this action")
            // const currentUser = await ModelDb.EmployeeModel.findOne({
            //     _id: user.userId,
            //     role: "employee",
            //     isDeleted: false,
            // })

            // if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },
    userOrEmployee: async (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.user || user.role !== role.employee) throw new Error("You don't have permission for this action")
            // const currentUser = await ModelDb.UserModel.findOne({
            //     _id: user.userId,
            //     role: ["user"],
            //     isDeleted: false,
            //     isVerified: true
            // })

            // const currentEpmloyee = await ModelDb.EmployeeModel.findOne({
            //     _id: user.userId,
            //     role: "employee",
            //     isDeleted: false
            // })
            // if (!currentUser && !currentEpmloyee) throw new Error("You don't have permission for this action")

            next()

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    manager: async (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.manager) throw new Error(`You don't have permission for this action`)
            // const currentUser = await ModelDb.UserModel.findOne({
            //     _id: user.userId,
            //     role: "manager",
            //     isDeleted: false,
            //     isVerified: true
            // })

            // if (!currentUser) throw new Error("You don't have permission for this action")
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
            if (user.role !== role.admin) throw new Error("You don't have permission for this action")
            // const currentUser = await ModelDb.UserModel.findOne({
            //     _id: user.userId,
            //     role: "admin",
            //     isDeleted: false,
            //     isVerified: true
            // })

            // if (!currentUser) throw new Error("You don't have permission for this action")

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
            if (user.role !== role.admin || user.role !== role.manager) throw new Error("You don't have permission for this action")
            // const currentUser = await ModelDb.UserModel.findOne({
            //     _id: user.userId,
            //     role: { $in: ["manager", "admin"] },
            //     isDeleted: false,
            //     isVerified: true
            // })
            // if (!currentUser) throw new Error("You don't have permission for this action")

            next()
        }
        catch (err) {
            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    }
}

export default authorization