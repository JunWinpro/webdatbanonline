import joi from "joi";
import trimString from "../../utils/trimString.js";
import messages from "./messages.js";



const employeeSchema = {
    username: joi.string().alphanum().min(5).max(10).messages({
        ...messages.username
    }),

    phone: joi.string().regex(/^\d{10}$/).messages({
        ...messages.phone
    }),

    password: joi.string().min(8).max(12).messages({
        ...messages.password
    }),

    newPassword: joi.string().min(8).max(12).messages({
        ...messages.newPassword
    }),

    firstName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.firstName
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("First name can't be empty")
        return trimString(value)
    }),

    lastName: joi.string().regex(/^[a-zA-Z]+$/).min(2).messages({
        ...messages.lastName
    }).custom((value, helpers) => {
        if (trimString(value).length === 0) return helpers.message("Last name can't be empty")
        return trimString(value)
    }),

    gender: joi.string().valid('male', 'female', 'other').messages({
        ...messages.gender
    }),

    restaurantId: joi.string().hex().length(24).messages({
        ...messages.restaurantId
    }).custom((value, helpers) => {
        if (trimString(value).length !== 24) return helpers.message("Restaurant id is invalid")
        return trimString(value)
    })
}

const employeeValidate = {
    register: joi.object({
        username: employeeSchema.username.required(),
        phone: employeeSchema.phone.required(),
        password: employeeSchema.password.required(),
        firstName: employeeSchema.firstName.required(),
        lastName: employeeSchema.lastName.required(),
        gender: employeeSchema.gender.required(),
        restaurantId: employeeSchema.restaurantId.required()
    }),

    login: joi.object({
        username: employeeSchema.username,
        phone: employeeSchema.phone,
        password: employeeSchema.password.required(),
    }).xor('username', 'phone')
        .with('username', 'password')
        .with('phone', 'password')
        .messages({
            'object.missing': "Username/phone is required",
            'object.xor': 'Please use only username or phone',
        }),

    updatePassword: joi.object({
        password: employeeSchema.password.required(),
        newPassword: employeeSchema.newPassword.required(),
    }),

    updateInfo: joi.object({
        firstName: employeeSchema.firstName,
        lastName: employeeSchema.lastName,
        gender: employeeSchema.gender,
        phone: employeeSchema.phone,
    })
}

export default employeeValidate