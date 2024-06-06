import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import userController from '../../controllers/user.controller.js'
import validateData from '../../middlewares/validate.middleware.js'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'

const userRoute = express.Router()

userRoute.post('/register', validateData.user.register, userController.register)
userRoute.post('/login', validateData.user.login, userController.login)
userRoute.post('/forget-password', validateData.user.forgetPassword, userController.forgetPassword)

userRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.admin, userController.getAllUsers)
userRoute.get('/:id', tokenMiddleware.verifyAccessToken, userController.getUserById)

userRoute.put('/reset-password/:token', validateData.user.resetPassword, userController.resetPassword)
userRoute.put('/:id', tokenMiddleware.verifyAccessToken, memoryUploader.single('file'), validateData.user.update, userController.updateUserById)
userRoute.put('/change-role/:id', tokenMiddleware.verifyAccessToken, authorization.admin, validateData.user.changeRole, userController.changeRole,)

userRoute.delete('/:id', tokenMiddleware.verifyAccessToken, userController.deleteUserById)

export default userRoute    