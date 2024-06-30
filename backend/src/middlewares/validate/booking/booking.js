import returnError from "../../../errors/error.js"
import bookingValidate from "../../../validateSchema/booking.validate.js"

const bookingValidateData = {
    createBooking: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.createBooking.validate(req.body)
            console.log(error?.details[0].message)
            if (error) throw new Error(error.details[0].message)
            const user = req.user
            req.body = value
            next()

        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default bookingValidateData