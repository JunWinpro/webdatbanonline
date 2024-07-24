import express from 'express'
import tokenMiddleware from '../../middlewares/token.middleware.js'
import validateData from '../../middlewares/validate/index.js'
import reviewController from '../../controllers/review.controller.js'

const reviewRoute = express.Router()

reviewRoute.post('/', tokenMiddleware.verifyAccessToken, validateData.review.createReview, reviewController.createReview)
reviewRoute.get('/:id', validateData.objectId, validateData.review.getReviews, reviewController.getReviews)
export default reviewRoute