import joi from "joi";
import trimString from "../../utils/trimString.js";
import messages from './messages.js'

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

    role: joi.string().valid('manager', 'admin', 'user').messages({
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
        password: userSchema.password.required(),
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