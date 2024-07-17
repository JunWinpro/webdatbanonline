import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import bookingController from '../../controllers/booking.controller.js'

const bookingRoute = express.Router()

bookingRoute.post('/user', tokenMiddleware.verifyAccessToken, authorization.user, validateData.booking.userBooking,
    bookingController.userBooking
)

bookingRoute.post('/employee', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.booking.employeeBooking, bookingController.employeeBooking)

bookingRoute.get('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, bookingController.getBookingListByRestaurantId)
export default bookingRoute