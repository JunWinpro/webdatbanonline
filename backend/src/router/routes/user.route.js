import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import userController from '../../controllers/user.controller.js'
import validateData from '../../middlewares/validate.middleware.js'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'

const userRoute = express.Router()

userRoute.post('/register', validateData.user.register, userController.register)
userRoute.post('/login', validateData.user.login, userController.login)

userRoute.get('/', tokenMiddleware.verifyAccessToken, userController.getAllUsers)

userRoute.get('/:id', tokenMiddleware.verifyAccessToken, userController.getUserById)

userRoute.put('/:id', tokenMiddleware.verifyAccessToken, memoryUploader.single('file'), validateData.user.update, userController.updateUserById)

userRoute.put('/add-role/:id', tokenMiddleware.verifyAccessToken, memoryUploader.single('file'), validateData.user.update, userController.updateUserById)

userRoute.put('/role/:id', tokenMiddleware.verifyAccessToken, authorization.admin, validateData.user.changeRole, userController.changeRole,)

userRoute.delete('/:id', tokenMiddleware.verifyAccessToken, userController.deleteUserById)

export default userRoute    