import joi from "joi"
import trimString from "../../utils/trimString.js"
import convertUnicode from "../../utils/unidecode.js"
import lowerCaseString from "../../utils/lowerCaseString.js"
import messages from "./messages.js";




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
        price: menuSchema.price,
        discount: menuSchema.discount,
        restaurantId: menuSchema.restaurantId.required()
    }),

    uploadMenuImage: joi.object({
        restaurantId: menuSchema.restaurantId.required()
    })


}

export default menuValidate