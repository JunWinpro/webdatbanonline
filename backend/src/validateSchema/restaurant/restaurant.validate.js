import joi from "joi";
import trimString from "../../utils/trimString.js";
import lowerCaseString from "../../utils/lowerCaseString.js";
import convertUnicode from "../../utils/unidecode.js";
import messages from "./messages.js";


const restaurantSchema = {
    name: joi.string().regex(/^[a-zA-Z0-9\s]+$/).messages({
        ...messages.name
    }).custom((value, helpers) => {
        if (value.trim().length === 0) {
            return helpers.message("Name can't be empty")
        }
        return trimString(value)
    }),

    address: joi.object({
        streetAddress: joi.string().messages({
            ...messages.address.streetAddress
        }).required()
            .custom((value, helpers) => {
                if (trimString(value).length === 0) return helpers.message("Street address can't be empty")
                return trimString(value)
            }),

        district: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
            ...messages.address.district
        }).required()
            .custom((value, helpers) => {
                if (trimString(value).length === 0) return helpers.message("District can't be empty")
                return trimString(value)
            }),

        city: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
            ...messages.address.city
        }).required()
            .custom((value, helpers) => {
                if (trimString(value).length === 0) return helpers.message("City can't be empty")
                return trimString(value)
            })

    }).messages({
        ...messages.address.address
    }),

    category: joi.array()
        .items(
            joi.string().alphanum()).messages({
                ...messages.category
            }).custom((value, helpers) => {
                if (value.length === 0) return helpers.message("Category can't be empty")
                return value
            }),

    totalTable: joi.number().integer().min(1).messages({
        ...messages.totalTable
    }),
}
const restaurantInfoSchema = {
    maxim: joi.string().messages({
        ...messages.maxim
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Maxim can't be empty")
        return trimString(value)
    }),

    description: joi.array().items(
        joi.object({
            title: joi.string().required().messages({
                ...messages.description.title
            }).custom((value, helpers) => {
                if (trimString(value).length === 0) {
                    return helpers.message("Title can't be empty")
                }
                return trimString(value)
            }),

            content: joi.string().required().messages({
                ...messages.description.content
            }).custom((value, helpers) => {
                if (trimString(value).length === 0) {
                    return helpers.message("Content can't be empty")
                }
                return trimString(value)
            }),
        })
    ).messages({
        ...messages.description.description
    }),

    schedule: joi.array().items(
        joi.object({
            dayOfWeek: joi.number().integer().min(0).max(6).required().messages({
                ...messages.schedule.dayOfWeek
            }),

            isWorkingDay: joi.boolean().required().messages({
                ...messages.schedule.isWorkingDay
            }),

            openTime: joi.number().min(0).less(24).required().messages({
                ...messages.schedule.openTime
            }),

            closeTime: joi.number().min(0).less(24).required().messages({
                ...messages.schedule.closeTime
            }),

        }).custom((value, helpers) => {
            const { openTime, closeTime } = value
            if (openTime >= closeTime) {
                return helpers.message("Open time must be before close time")
            }

            return value
        })

    ).unique((a, b) => a.dayOfWeek === b.dayOfWeek).messages({
        ...messages.schedule.schedule
    }).custom((value, helpers) => {
        if (value.length < 7) {
            return helpers.message("Schedule need full fill 7 days")
        }
        return value
    })
}

const sortType = ['rating', 'price', 'new', 'name']
const sortValue = ['asc', 'desc']
const restaurantQuerySchema = {
    name: joi.string().regex(/^[\p{L}\p{N}\s]+$/u).messages({
        'string.base': "Name must be a string",
        'string.empty': "Name is empty",
        'string.pattern.base': "Name can't contain special character"
    }).custom((value, helpers) => {
        if (value.trim().length === 0) {
            return helpers.message("Name can't be empty")
        }
        return convertUnicode(lowerCaseString(trimString(value)))
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

    district: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
        ...messages.address.district
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("District can't be empty")
        return convertUnicode(lowerCaseString(trimString(value)))
    }),

    city: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
        ...messages.address.city
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("City can't be empty")
        return convertUnicode(lowerCaseString(trimString(value)))
    }),

    category: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
        'any.invalid': 'Category must be a string or an array of strings',
        'string.empty': "Category can't be empty",
        'string.pattern.base': "Category can't contain special character"
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Category can't be empty")
        return convertUnicode(lowerCaseString(trimString(value)))
    }),

    sortBy: joi.alternatives().try(
        joi.string().custom((value, helpers) => {

            if (trimString(value).length === 0) return helpers.message("Sort by can't be empty")
            const [type, sort] = value.split("_")
            if (!sortValue.includes(sort)) return helpers.message("Sort value must be asc or desc")
            if (!sortType.includes(type)) return helpers.message("Sort type must be rating, price, new or name")
            return convertUnicode(lowerCaseString(trimString(value)))
        }),

        joi.array().items(joi.string().custom((value, helpers) => {

            if (trimString(value).length === 0) return helpers.message("Sort by can't be empty")
            const [type, sort] = value.split("_")

            if (!sortValue.includes(sort)) return helpers.message("Sort value must be asc or desc")
            if (!sortType.includes(type)) return helpers.message("Sort type must be rating, price, new or name")
            return convertUnicode(lowerCaseString(trimString(value)))
        }))
    ).messages({
        'any.invalid': 'Sort by must be a string or an array of strings',
        'string.empty': "Sort by can't be empty"
    })
}

const restaurantValidate = {
    createRestaurant: joi.object({
        name: restaurantSchema.name.required(),
        address: restaurantSchema.address.required(),
        category: restaurantSchema.category.required(),
        totalTable: restaurantSchema.totalTable.required(),
        maxim: restaurantInfoSchema.maxim,
        description: restaurantInfoSchema.description,
        schedule: restaurantInfoSchema.schedule.required(),
    }),

    getRestaurants: joi.object({
        name: restaurantQuerySchema.name,
        page: restaurantQuerySchema.page,
        pageSize: restaurantQuerySchema.pageSize,
        city: restaurantQuerySchema.city,
        district: restaurantQuerySchema.district,
        category: restaurantQuerySchema.category,
        sortBy: restaurantQuerySchema.sortBy
    }),

    updateRestaurant: joi.object({
        name: restaurantSchema.name,
        address: restaurantSchema.address,
        category: restaurantSchema.category,
    }),

    updateRestaurantInfo: joi.object({
        maxim: restaurantInfoSchema.maxim,
        description: restaurantInfoSchema.description,
        schedule: restaurantInfoSchema.schedule,
        totalTable: restaurantSchema.totalTable,
    })

}

export default restaurantValidate