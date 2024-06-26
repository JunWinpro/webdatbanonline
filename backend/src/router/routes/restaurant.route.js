import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import authorization from '../../middlewares/authorization.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import restaurantController from '../../controllers/restaurant.controller.js'
import { memoryUploader } from '../../middlewares/uploader.middleware.js'
import imageValidate from '../../middlewares/imageValidate.middleware.js'

const restaurantRoute = express.Router()

restaurantRoute.post('/create-restaurant', tokenMiddleware.verifyAccessToken, authorization.manager,
    memoryUploader.fields([
        { name: 'foodImages' },
        { name: 'menuImages' },
        { name: 'restaurantImages' },
        { name: 'avatar', maxCount: 1 }
    ]), imageValidate, validateData.restaurant.createRestaurant, restaurantController.createRestaurant)

restaurantRoute.get('/', validateData.restaurant.getRestaurants, restaurantController.getRestaurants)
restaurantRoute.get('/:id', restaurantController.getRestaurantById)

restaurantRoute.put('/:id', validateData.restaurant.updateRestaurantById)

export default restaurantRoute