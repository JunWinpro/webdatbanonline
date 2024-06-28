import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import employeeController from '../../controllers/employee.controller.js'
import validateData from '../../middlewares/validate/index.js'


const employeeRoute = express.Router()

employeeRoute.post('/register', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.employee.register, employeeController.register)
employeeRoute.post('/login', validateData.employee.login, employeeController.login)

employeeRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.getEmployees)
employeeRoute.get('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, employeeController.getEmployeeById)

employeeRoute.put('/password/:id', tokenMiddleware.verifyAccessToken, authorization.employee, validateData.objectId, validateData.employee.updatePassword, employeeController.updateEmployeePasswordById)
employeeRoute.put('/info/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, validateData.employee.updateInfo, employeeController.updateEmployeeInfoById)

employeeRoute.delete('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, employeeController.deleteEmployeeById)

export default employeeRoute    