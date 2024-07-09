import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import menuController from '../../controllers/menu.controller.js'
import authorization from '../../middlewares/authorization.middleware.js'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import imageValidate from '../../middlewares/imageValidate.middleware.js'
import validateData from '../../middlewares/validate/index.js'

const menuRoute = express.Router()

menuRoute.post('/upload/image/:id', tokenMiddleware.verifyAccessToken, authorization.manager, memoryUploader.single('file'), imageValidate.file, validateData.objectId, validateData.menu.uploadMenuImage, menuController.uploadMenuImage)

menuRoute.post('/', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.menu.createMenu, menuController.createMenu)

menuRoute.get('/:id', validateData.objectId, menuController.getMenuById)
menuRoute.get('/restaurant/:id', validateData.objectId, menuController.getMenuByRestaurantId)

menuRoute.put('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, validateData.menu.updateMenu, menuController.updateMenuById)

menuRoute.delete('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, menuController.deleteMenuById)
export default menuRoute