import joi from "joi"

const messages = {
    name: {
        'string.pattern.base': "Name cannot contain spaces or special characters or number",
        'string.min': "Name must have at least 1 character",
        'string.empty': "Name  is empty",
        'any.required': "Name is required"
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
        'number.min': "Price must be greater than 0",
    },

    discount: {
        'any.required': "Discount is required",
        'number.base': "Discount must be a number",
        'number.min': "Discount must be greater than 0",
    },

    isSelling: {
        'any.required': "Is selling is required",
        'boolean.base': "Is selling must be a boolean",
    },

    isDeleted: {
        'any.required': "Is deleted is required",
        'boolean.base': "Is deleted must be a boolean",
    },
}


const menuSchema = {
    name: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.name
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

    isSelling: joi.boolean().messages({
        ...messages.isSelling
    }),

    isDeleted: joi.boolean().messages({
        ...messages.isDeleted
    }),
}

const menuValidate = {
    createMenu: joi.object({
        type: menuSchema.type.required(),
        unit: menuSchema.unit.required(),
        price: menuSchema.price.required(),
        discount: menuSchema.discount.required()
    }),
}

export default menuValidate