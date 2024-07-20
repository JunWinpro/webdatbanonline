import returnError from "../errors/error.js"

const role = {
    user: process.env.USER,
    employee: process.env.EMPLOYEE,
    admin: process.env.ADMIN,
    manager: process.env.MANAGER
}

const authorization = {
    user: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.user) throw new Error("You don't have permission for this action")
            next()
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    employee: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.employee) throw new Error("You don't have permission for this action")
            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },
    userOrEmployee: (req, res, next) => {
        try {
            const user = req.user
            if (user.role === role.user || user.role === role.employee) next()
            else throw new Error("You don't have permission for this action")
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    manager: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.manager) throw new Error(`You don't have permission for this action`)
            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },

    admin: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.admin) throw new Error("You don't have permission for this action")
            next()
        }
        catch (err) {

            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },

    managerOrAdmin: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.admin || user.role !== role.manager) throw new Error("You don't have permission for this action")
            next()
        }
        catch (err) {
            console.log("Authorization err: ", err)
            returnError(res, 403, err)
        }
    },
    employeeOrManager: (req, res, next) => {
        try {
            const user = req.user
            if (user.role !== role.employee || user.role !== role.manager) throw new Error("You don't have permission for this action")
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default authorization