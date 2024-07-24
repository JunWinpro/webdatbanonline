import baseFolder from "../configs/cloudinaryFolder.config.js"
import dataResponse from "../dataResponse/data.response.js"
import reviewResponse from "../dataResponse/review.js"
import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import cloudinaryUploader from "../utils/cloudinaryUploader.js"
import getPublicId from "../utils/getPublicId.js"
import pageSplit from "../utils/pageSplit.util.js"

const reviewController = {
    createReview: async (req, res) => {
        try {
            const { restaurantId, rating } = req.body
            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                isActive: true,
                isDeleted: false
            })
            if (!restaurant) throw new Error("Restaurant not found")
            restaurant.rating = (restaurant.rating || 0 + rating) / (restaurant.totalRating + 1)
            restaurant.totalRating++
            await restaurant.save()

            const reviewExist = await ModelDb.ReviewModel.findOne({
                author: user.userId,
                restaurant: restaurantId,
                isDeleted: false
            })
            if (!reviewExist) throw new Error("You have already reviewed this restaurant")
            const review = await ModelDb.ReviewModel.create({
                ...req.body,
                author: user.userId,
                restaurant: restaurantId
            })
            const message = "Review created successfully"
            dataResponse(res, 200, message, reviewResponse(review))

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    uploadReviewImages: async (req, res) => {
        try {
            const { restaurantId, deleteImageUrls } = req.body
            const user = req.user
            const review = await ModelDb.ReviewModel.findOne({
                author: user.userId,
                restaurant: restaurantId,
                isDeleted: false
            }).populate('restaurant')
            if (!review) throw new Error("No review found")
            if (review.restaurant.isDeleted) throw new Error("Restaurant not found")
            if (!review.restaurant.isActive) throw new Error("Restaurant not active")

            if (deleteImageUrls?.length > 0) {
                const newImageList = review.reviewImages.filter(image => !deleteImageUrls.includes(image))
                deleteImageUrls.forEach(async url => {
                    const publicId = getPublicId(url)
                    if (!publicId) throw new Error("Invalid image url")
                    const destroyResult = await cloudinaryUploader.destroy(publicId)
                    if (destroyResult.result === "not found") throw new Error("Delete image failed: Image not found")
                    if (destroyResult.result !== 'ok') throw new Error("Delete image failed: Server error")
                })
                review.reviewImages = newImageList
                await review.save()
            }
            if (req.files.length > 0) {
                const folder = `${baseFolder.RESTAURANT}/${restaurantId}/${baseFolder.REVIEW}/${review._id}`
                req.files.forEach(async file => {
                    const result = await cloudinaryUploader.upload(file, folder)
                    if (!result.secure_url) throw new Error("Upload failed")
                    review.reviewImages.push(result.secure_url)
                })
                await review.save()
            }
            const message = "Images uploaded successfully"
            dataResponse(res, 200, message, reviewResponse(review))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getReviews: async (req, res) => {
        try {
            const { id } = req.params
            const { page, pageSize } = req.query
            const filterModel = {}
            filterModel.restaurant = id
            const sortModel = {
                createdAt: -1
            }
            const reviews = await pageSplit(ModelDb.ReviewModel, page, pageSize, sortModel, undefined)
            if (reviews.length === 0) throw new Error("No reviews at current")
            reviews.data = reviews.data?.map(item => reviewResponse(item))
            dataResponse(res, 200, message, reviews)
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}
export default reviewController