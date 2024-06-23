import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import menuController from '../../controllers/menu.controller.js'
import authorization from '../../middlewares/authorization.middleware.js'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import imageValidate from '../../middlewares/imageValidate.middleware.js'
import validateData from '../../middlewares/validate/index.js'

const menuRoute = express.Router()

menuRoute.post('/', tokenMiddleware.verifyAccessToken, authorization.manager, memoryUploader.single('file'),
    imageValidate, validateData.menu.createMenu, menuController.createMenu)




export default menuRoute