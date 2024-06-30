import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'

const bookingRoute = express.Router()

bookingRoute.post('/user', tokenMiddleware.verifyAccessToken, authorization.user,)
bookingRoute.post('/employee', tokenMiddleware.verifyAccessToken, authorization.employee,)

export default bookingRoute