import returnError from "../../../errors/error.js"
import date from "../../../utils/date.util.js"
import bookingValidate from "../../../validateSchema/booking/booking.validate.js"

const bookingValidateData = {
    createBooking: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.createBooking.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            const { checkinTime } = req.body
            const { second, minutes } = date(checkinTime)
            const acceptMinute = [0, 15, 30, 45]
            if (!acceptMinute.includes(minutes)) throw new Error("Minutes are not correct")
            if (second !== 0) throw new Error("Second is not correct")
            next()

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getBooking: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.getBookings.validate(req.query)
            if (error) throw new Error(error.details[0].message)
            req.query = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateBookingInfo: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.updateBooking.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }

}

export default bookingValidateData