import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import employeeController from '../../controllers/employee.controller.js'
import validateData from '../../middlewares/validate/index.js'


const employeeRoute = express.Router()

employeeRoute.post('/register/:restaurantId', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.employee.register, employeeController.register)
employeeRoute.post('/login', validateData.employee.login, employeeController.login)

employeeRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.getEmployees)
employeeRoute.get('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.getEmployeeById)

employeeRoute.put('/:id', tokenMiddleware.verifyAccessToken, validateData.employee.update, employeeController.updateEmployeeById)

employeeRoute.delete('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.deleteEmployeeById)

export default employeeRoute    