import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import userController from '../../controllers/user.controller.js'
import middleware from '../../middlewares/middleware.js'
import validateData from '../../middlewares/validate.middleware.js'
const userRoute = express.Router()

userRoute.post('/register/user', validateData.user.register, userController.register)
userRoute.post('/login', validateData.user.login, userController.login)

userRoute.get('/', middleware.verifyAccessToken, userController.getAllUsers)
userRoute.get('/:id', middleware.verifyAccessToken, userController.getUserById)

userRoute.put('/:id', middleware.verifyAccessToken, memoryUploader.single('file'), validateData.user.update, userController.updateUserById)
export default userRoute