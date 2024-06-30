import joi from "joi"
import trimString from "../utils/trimString.js"
import convertUnicode from "../utils/unidecode.js"
import lowerCaseString from "../utils/lowerCaseString.js"

const messages = {
    name: {
        'string.pattern.base': "Name cannot contain spaces or special characters or number",
        'string.empty': "Name is empty",
        'any.required': "Name is required"
    },
    description: {
        'string.pattern.base': "Description cannot contain spaces or special character",
        'string.empty': "Description  is empty",
        'any.required': "Description is required"
    },
    type: {
        'any.required': "Type is required",
        'string.empty': "Type is empty",
        'any.only': "Type must be food or drink",
    },

    unit: {
        'any.required': "Unit is required",
        'string.empty': "Unit is empty",
        'any.only': "Unit must be plate or cup",
    },

    price: {
        'any.required': "Price is required",
        'number.base': "Price must be a number",
        'number.min': "Price must be 0 or higher",
    },

    discount: {
        'any.required': "Discount is required",
        'number.base': "Discount must be a number",
        'number.min': "Discount must be 0 or higher",
    },

    restaurantId: {
        'string.hex': "Restaurant id must be a valid ObjectId",
        'string.empty': 'Restaurant id is empty',
        'any.required': 'Restaurant id is required'
    }
}


const menuSchema = {
    name: joi.string().regex(/^[a-zA-Z\s]+$/).messages({
        ...messages.name
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Name can't be empty")
        return convertUnicode(lowerCaseString(trimString(value)))
    }),
    description: joi.string().regex(/^[A-Za-z0-9\s]+$/).messages({
        ...messages.description
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Description can't be empty")
        return convertUnicode(lowerCaseString(trimString(value)))
    }),
    type: joi.string().valid("food", "drink").messages({
        ...messages.type
    }),

    unit: joi.string().valid("plate", "cup").messages({
        ...messages.unit
    }),

    price: joi.number().min(0).messages({
        ...messages.price
    }),

    discount: joi.number().min(0).max(100).messages({
        ...messages.discount
    }),

    restaurantId: joi.string().hex().length(24).messages({
        ...messages.restaurantId
    })
}

const menuValidate = {
    createMenu: joi.object({
        name: menuSchema.name.required(),
        type: menuSchema.type.required(),
        unit: menuSchema.unit.required(),
        price: menuSchema.price.required(),
        discount: menuSchema.discount.required(),
        restaurantId: menuSchema.restaurantId.required()
    }),

    updateMenu: joi.object({
        name: menuSchema.name,
        type: menuSchema.type,
        unit: menuSchema.unit,
        price: menuSchema.price,
        discount: menuSchema.discount,
        restaurantId: menuSchema.restaurantId.required()
    }),

    uploadMenuImage: joi.object({
        restaurantId: menuSchema.restaurantId.required()
    })


}

export default menuValidate