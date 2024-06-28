import joi from "joi";
import trimString from "../utils/trimString.js";
import lowerCaseString from "../utils/lowerCaseString.js";
import convertUnicode from "../utils/unidecode.js";
const messages = {
    name: {
        'any.required': "Name is required",
        'string.pattern.base': "Name can't contain special characters",
        'string.min': "Name must have at least one character",
        'string.empty': "Name can't be empty"
    },

    address: {
        address: {
            'object.base': "Address is object and must include streetAddress, district, and city",
            'any.required': "Address is required",
        },
        streetAddress: {
            'any.required': "Street address is required",
            'string.min': "Street address must have at least one character",
            'string.empty': "Street address can't be empty"
        },
        district: {
            'any.required': "District is required",
            'string.min': "District must have at least one character",
            'string.empty': "District can't be empty",
            'string.pattern.base': "District can't have special character or number"
        },
        city: {
            'any.required': "City is required",
            'string.min': "City must have at least one character",
            'string.empty': "City can't be empty",
            'string.pattern.base': "City can't have special character or number"
        },
    },

    category: {
        'any.required': "Category is required",
        'string.empty': "Category can't be empty",
        'string.alphanum': "Category must not include special characters or spaces"
    },

    tableList: {
        tableList: {
            'array.base': "Table list is an array of objects with tableId and isEmpty",
            'array.unique': "Table ID is duplicated"
        },
        tableId: {
            'any.required': "Table ID is required",
            'number.base': "Table ID must be a number",
            'number.empty': "Table ID can't be empty"
        },
        isEmpty: {
            'any.required': "Table status is required",
            'boolean.base': "Table status must be a boolean",
            'boolean.empty': "Table status can't be empty"
        }
    },

    maxim: {
        'any.required': "Restaurant maxim is required",
        'string.empty': "Restaurant maxim can't be empty"
    },

    description: {
        description: {
            'object.base': "Description element is object and must include both title and content",
            'any.required': "Description is required",
            'array.base': "Description is an array that includes object with title and content"
        },

        title: {
            'any.required': "Title is required",
            'string.empty': "Title can't be empty",
            'string.pattern.base': "Title can't have special characters"
        },

        content: {
            'any.required': "Content is required",
            'string.empty': "Content can't be empty",
            'string.pattern.base': "Content can't have special characters"
        }
    },
    schedule: {
        schedule: {
            'any.required': "Schedule is required",
            'array.unique': "Day of the week is duplicated",
            'array.base': "Schedule is an array of objects with dayOfWeek, isWorkingDay, openTime and closeTime"
        },

        isWorkingDay: {
            'any.required': "Working day is required",
            'boolean.base': "Working day must be a boolean",
            'boolean.empty': "Working day can't be empty"
        },

        dayOfWeek: {
            'number.base': "Day of the week is a number from 0 to 6 (Sunday to Saturday)",
            'number.min': "Day of the week minimum is 0",
            'number.max': "Day of the week maximum is 6",
            'any.required': "Day of the week is required"
        },

        openTime: {
            'number.base': "Open time is a number for hour",
            'number.min': "Open time minimum is 0",
            'number.max': "Open time maximum is less than 24",
            'any.required': "Open time is required"
        },

        closeTime: {
            'number.base': "Close time is a number",
            'number.min': "Close time minimum is 0",
            'number.max': "Close time maximum is less than 24",
            'any.required': "Close time is required"
        },
    },

    description: {
        description: {
            'array.base': "Description must be an array of objects with title and content",
            'object.base': "Missing title or content"
        },
        title: {
            'string.empty': "Title can't be empty",
            'any.required': "Title is required"
        },
        content: {
            'string.empty': "Content can't be empty",
            'any.required': "Content is required"
        }
    },
}

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
            }),

    tableList: joi.array().items(joi.object({
        tableId: joi.number().required().messages({
            ...messages.tableList.tableId
        }),

        isEmpty: joi.boolean().required().messages({
            ...messages.tableList.isEmpty
        })
    })).unique((a, b) => a.tableId === b.tableId).messages({
        ...messages.tableList.tableList
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
        tableList: restaurantSchema.tableList.required(),
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
        tableList: restaurantSchema.tableList,
    })

}

export default restaurantValidate