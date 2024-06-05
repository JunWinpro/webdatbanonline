const authorization = {

    employee: async (req, res, next) => {
        try {
            const role = req.user.role

            if (role !== "employee") throw new Error("You don't have permission for this action")

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
            const role = req.user.role

            if (role !== "manager") throw new Error("You don't have permission for this action")

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
            const role = req.user.role

            if (role !== "admin") throw new Error("You don't have permission for this action")
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