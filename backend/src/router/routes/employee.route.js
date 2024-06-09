import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import employeeController from '../../controllers/employee.controller.js'
import validateData from '../../middlewares/validate/index.js'


const employeeRoute = express.Router()

employeeRoute.post('/register', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.employee.register, employeeController.register)
employeeRoute.post('/login', validateData.employee.login, employeeController.login)

// employeeRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.getAllUsers)
employeeRoute.get('/:id', tokenMiddleware.verifyAccessToken, employeeController.getEmployeeById)

// employeeRoute.put('/reset-password/:token', validateData.user.resetPassword, employeeController.resetPassword)
// employeeRoute.put('/:id', tokenMiddleware.verifyAccessToken, memoryUploader.single('file'), validateData.user.update, employeeController.updateUserById)

employeeRoute.delete('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, employeeController.deleteEmployeeById)

export default employeeRoute    