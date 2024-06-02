import joi from 'joi';
import userSchema from '../validateSchema/user.schema.js';
const validateData = {
    user: {
        register: (req, res, next) => {
            try {


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
                const { email, phone } = req.body

                if (email.length >= 0 && phone >= 0) throw new Error("Please enter only valid email or phone number")

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
                if (file && file.length <= 0)

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

}

export default validateData