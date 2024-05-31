import express from 'express'
import { memoryUploader } from '../../middlewares/uploader.middleware'
import userController from '../../controllers/user.controller'
const userRoute = express.Router()

userRoute.post('/register', memoryUploader.single('file'), userController)
userRoute.post('/login', userController)
export default userRoute