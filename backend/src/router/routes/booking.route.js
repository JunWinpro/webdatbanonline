import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import bookingController from '../../controllers/booking.controller.js'

const bookingRoute = express.Router()

bookingRoute.post('/', tokenMiddleware.verifyAccessToken, validateData.booking.createBooking,
    bookingController.createBooking
)
bookingRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.employeeOrManager, validateData.booking.getBooking, bookingController.getBookings)

bookingRoute.get('/:id', tokenMiddleware.verifyAccessToken, authorization.employeeOrManager, validateData.objectId, bookingController.getBookings)

bookingRoute.put('/info/:id', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.objectId, validateData.booking.updateBookingInfo, bookingController.updateBookingInfo)

bookingRoute.put('/checkin/:id', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.objectId, bookingController.updateBookingStatus)

bookingRoute.put('/finish/:id', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.objectId, bookingController.updateBookingStatus)

bookingRoute.put('/cancel/:id', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.objectId, bookingController.updateBookingStatus)

export default bookingRoute