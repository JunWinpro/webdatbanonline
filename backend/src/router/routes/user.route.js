import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import userController from '../../controllers/user.controller.js'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import imageValidate from '../../middlewares/imageValidate.middleware.js'

const userRoute = express.Router()

userRoute.post('/upload/avatar/:id', tokenMiddleware.verifyAccessToken, memoryUploader.single('file'), imageValidate.file, validateData.objectId, userController.uploadAvatar)

userRoute.post('/register', validateData.user.register, userController.register)

userRoute.post('/login', validateData.user.login, userController.login)

userRoute.post('/forget-password', validateData.user.forgetPassword, userController.forgetPassword)

userRoute.get('/', tokenMiddleware.verifyAccessToken, authorization.admin, userController.getUsers)

userRoute.get('/:id', tokenMiddleware.verifyAccessToken, validateData.objectId, userController.getUserById)

userRoute.put('/reset-password/:token', validateData.user.resetPassword, userController.resetPassword)

userRoute.put('/:id', tokenMiddleware.verifyAccessToken, validateData.objectId, validateData.user.update, userController.updateUserById)

userRoute.put('/change-role/:id', tokenMiddleware.verifyAccessToken, authorization.admin, validateData.objectId, validateData.user.changeRole, userController.changeRole)

userRoute.put('/verify-user/:token', userController.verifyUser)

userRoute.put('/recover-account', tokenMiddleware.verifyAccessToken, authorization.admin, userController.recoverAccount)



userRoute.delete('/:id', tokenMiddleware.verifyAccessToken, validateData.objectId, userController.deleteUserById)

export default userRoute    