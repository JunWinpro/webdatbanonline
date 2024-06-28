import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import restaurantController from '../../controllers/restaurant.controller.js'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import imageValidate from '../../middlewares/imageValidate.middleware.js'

const restaurantRoute = express.Router()

restaurantRoute.post('/upload/food-images/:id', tokenMiddleware.verifyAccessToken, authorization.manager,
    memoryUploader.array('files'), imageValidate.files, validateData.objectId, restaurantController.uploadRestaurantImages)
restaurantRoute.post('/upload/menu-images/:id', tokenMiddleware.verifyAccessToken, authorization.manager,
    memoryUploader.array('files'), imageValidate.files, validateData.objectId, restaurantController.uploadRestaurantImages)
restaurantRoute.post('/upload/restaurant-images/:id', tokenMiddleware.verifyAccessToken, authorization.manager,
    memoryUploader.array('files'), imageValidate.files, validateData.objectId, restaurantController.uploadRestaurantImages)

restaurantRoute.post('/upload/avatar/:id', tokenMiddleware.verifyAccessToken, authorization.manager, memoryUploader.single('file'), imageValidate.file, validateData.objectId, restaurantController.uploadRestaurantAvatar)

restaurantRoute.get('/', validateData.restaurant.getRestaurants, restaurantController.getRestaurants)
restaurantRoute.get('/restaurant/:id', restaurantController.getRestaurantById)
restaurantRoute.get('/owned', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.restaurant.getRestaurants, restaurantController.getOwnedRestaurants)

restaurantRoute.put('/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.objectId, validateData.restaurant.updateRestaurantById, restaurantController.updateRestaurantById)
restaurantRoute.put('/info/:id', tokenMiddleware.verifyAccessToken, authorization.manager, validateData.restaurant.updateRestaurantInfoById, restaurantController.updateRestaurantInfoById)

restaurantRoute.put('/approve/:id', tokenMiddleware.verifyAccessToken, authorization.admin, restaurantController.approveRestaurantById)

restaurantRoute.put('/active/:id', tokenMiddleware.verifyAccessToken, authorization.manager, restaurantController.activeRestaurantById)

restaurantRoute.put('/deactive/:id', tokenMiddleware.verifyAccessToken, authorization.manager, restaurantController.deactiveRestaurantById)


restaurantRoute.delete('/:id', tokenMiddleware.verifyAccessToken, authorization.managerOrAdmin, validateData.objectId, restaurantController.deleteRestaurantById)

export default restaurantRoute