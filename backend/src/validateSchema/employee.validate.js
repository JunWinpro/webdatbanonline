import joi from "joi";
import trimString from "../utils/trimString.js";
const messages = {
    username: {
        'string.alphanum': "Username cannot contain spaces or special characters",
        'string.min': "Username length must be from 5 to 10",
        'string.max': "Username length must be from 5 to 10",
        'string.empty': "Username is empty",
        'any.required': "Username is required"
    },
    phone: {
        'string.pattern.base': "Phone must be 10 numbers",
        'string.empty': "Phone is empty",
        'any.required': "Phone is required"
    },
    password: {
        'string.empty': "Password is empty",
        'string.min': "Password minimum length is 8 characters",
        'string.max': "Password maximum length is 12 characters",
        'any.required': "Password is required"
    },
    firstName: {
        'string.pattern.base': "First name cannot contain spaces or special characters or number",
        'string.min': "First name must have at least 1 character",
        'string.empty': "First name  is empty",
        'any.required': "First name is required"
    },
    lastName: {
        'string.pattern.base': "Last name cannot contain spaces or special characters or number",
        'string.min': "Last name must have at least 1 character",
        'string.empty': "Last name is empty",
        'any.required': "Last name is required"
    },
    gender: {
        'any.only': "Gender must be one of 'male', 'female', 'other'",
        'any.empty': "Gender is empty",
        'any.required': "Gender is required"
    },
}

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

}



const employeeValidate = {
    register: joi.object({
        username: employeeSchema.username.required(),
        phone: employeeSchema.phone.required(),
        password: employeeSchema.password.required(),
        firstName: employeeSchema.firstName.required(),
        lastName: employeeSchema.lastName.required(),
        gender: employeeSchema.gender.required()
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

    update: joi.object({
        password: employeeSchema.password.required(),
        newPassword: employeeSchema.password.required(),
    }),
}

export default employeeValidate