import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import billController from '../../controllers/bill.controller.js'

const billRoute = express.Router()

billRoute.post('/', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.bill.createBill, billController.createBill)

export default billRoute