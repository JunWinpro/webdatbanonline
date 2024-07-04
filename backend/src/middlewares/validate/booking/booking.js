import returnError from "../../../errors/error.js"
import date from "../../../utils/date.util.js"
import bookingValidate from "../../../validateSchema/booking/booking.validate.js"

const bookingValidateData = {
    userBooking: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.userBooking.validate(req.body)
            console.log(error?.details[0].message)
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

    employeeBooking: (req, res, next) => {
        try {
            const { error, value } = bookingValidate.employeeBooking.validate(req.body)
            console.log(error?.details[0].message)
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
    }

}

export default bookingValidateData