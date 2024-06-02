import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import userController from '../../controllers/user.controller.js'
import middleware from '../../middlewares/middleware.js'
const userRoute = express.Router()

userRoute.post('/register/user', userController.register.user)
userRoute.post('/register/employee', userController.register.employee)
userRoute.post('/login', userController.login)

userRoute.get('/', middleware.verifyAccessToken, userController.getAllUsers)
userRoute.get('/:id', userController.getUserById)

export default userRoute