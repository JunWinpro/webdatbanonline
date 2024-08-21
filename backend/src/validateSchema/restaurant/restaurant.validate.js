import joi from "joi";
import trimString from "../../utils/trimString.js";
import lowerCaseString from "../../utils/lowerCaseString.js";
import convertUnicode from "../../utils/unidecode.js";
import messages from "./messages.js";
import districts from "../../jsonDb/districts.json" with {type: "json"}
import cities from "../../jsonDb/cities.json" with {type: "json"}

const restaurantSchema = {
    name: joi.string().regex(/^[\p{L}\p{N}\s]+$/u).messages({
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

        district: joi.string().custom((value, helpers) => {
            if (!districts.find(item => item.code === value)) return helpers.message("Invalid district code")
            return value
        }),

        city: joi.string().custom((value, helpers) => {
            if (!cities.find(item => item.code === value)) return helpers.message("Invalid district code")
            return value
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