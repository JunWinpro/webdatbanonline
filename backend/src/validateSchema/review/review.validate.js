import joi from 'joi';
import trimString from '../../utils/trimString.js';
const reviewSchema = {
    restaurantId: joi.string().hex().length(24),
    title: joi.string().custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Title is empty")
        return trimString(value)
    }),
    content: joi.string().custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Content is empty")
        return trimString(value)
    }),
    rating: joi.number().min(1).max(5).custom((value, helpers) => {
        const lastNumber = value.toString().split('.')
        if (Number(lastNumber[1]) !== 5) throw new Error("Invalid rating: " + value)
        return value
    }),
    page: joi.string().regex(/^[0-9]+$/).messages({
        'string.empty': "Page can't be empty",
        'string.base': "Page must be a string",
        'string.pattern.base': "Page only contains integer number",
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Page can't be empty")

        if (!Number.isInteger(Number(value)))
            return helpers.message("Page can't be float")

        if (Number(value) <= 0)
            return helpers.message("Page can't be negative")

        return Number(value)
    }),

    pageSize: joi.string().regex(/^[0-9]+$/).messages({
        'string.empty': "Page size can't be empty",
        'string.base': "Page size must be a string",
        'string.pattern.base': "Page size only contains integer number",
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Page size can't be empty")

        if (!Number.isInteger(Number(value)))
            return helpers.message("Page size can't be float")

        if (Number(value) <= 0)
            return helpers.message("Page size can't be negative")

        return Number(value)
    }),
}

const reviewValidate = {
    createReview: joi.object({
        title: reviewSchema.title.required(),
        content: reviewSchema.content.required(),
        rating: reviewSchema.rating.required(),
        restaurantId: reviewSchema.restaurantId.required(),
    }),
    getReviews: joi.object({
        page: reviewSchema.page,
        pageSize: reviewSchema.pageSize,
    })
}

export default reviewValidate