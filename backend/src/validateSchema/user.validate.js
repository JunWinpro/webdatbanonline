import joi from "joi";
import trimString from "../utils/trimString.js";
const messages = {
    email: {
        'string.email': "Email must have at least 2 domain segments example: example.com",
        'string.empty': "Email is empty",
        'any.required': "Email is required"
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
    dateOfBirth: {
        'date.format': "Date of birth must be YYYY-MM-DD",
        'date.empty': "Date of birth is empty",
        'any.required': "Date is required",
        'date.max': "Date of birth cannot be in the future",
        'date.min': "Date of birth must be in or less 100 years",
        'date.base': "Invalid date of birth format"
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
    role: {
        'any.only': "Role must be one of 'manager', 'admin' or 'customer",
        'any.empty': "Role is empty",
        'any.required': "Role is required"
    }
}

const userSchema = {
    email: joi.string().email({ minDomainSegments: 2 }).messages({
        ...messages.email
    }),

    phone: joi.string().regex(/^\d{10}$/).messages({
        ...messages.phone
    }),

    password: joi.string().min(8).max(12).messages({
        ...messages.password
    }),

    firstName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.firstName
    }),

    lastName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.lastName
    }),

    gender: joi.string().valid('male', 'female', 'other').messages({
        ...messages.gender
    }),

    dateOfBirth: joi.date().iso().max('now').min(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000).messages({
        ...messages.dateOfBirth
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

    role: joi.string().valid('manager', 'admin', 'customer').messages({
        ...messages.role
    }),


}



const userValidate = {
    register: joi.object({
        email: userSchema.email.required(),
        phone: userSchema.phone.required(),
        password: userSchema.password.required(),
        firstName: userSchema.firstName.required(),
        lastName: userSchema.lastName.required(),
        gender: userSchema.gender.required()
    }),

    login: joi.object({
        email: userSchema.email.required(),
        password: userSchema.password.required(),
    }),

    update: joi.object({
        password: userSchema.password,
        phone: userSchema.phone,
        newPassword: userSchema.password,
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        gender: userSchema.gender,
        dateOfBirth: userSchema.dateOfBirth,
        address: userSchema.address
    }),

    changeRole: joi.object({
        role: userSchema.role.required()
    }),

    resetPassword: joi.object({
        newPassword: userSchema.password.required()
    }),

    forgetPassword: joi.object({
        email: userSchema.email.required()
    }),



}

export default userValidate