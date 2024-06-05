import joi from "joi";
const messages = {
    name: {
        empty: "Restaurant name is empty",
        required: "Restaurant name is required"
    },
    address: {
        streetAddress: {
            empty: 'Street address is empty',
            required: 'Street address is required'
        },
        city: {
            empty: 'City is empty',
            required: 'City is required'
        },
    },
    rating: {
        empty: "Rating is empty",
        required: "Rating is required"
    },
    isOpening: {
        empty: "Is opening  is empty",
        required: "Is opening is required"
    },
    lastName: {
        pattern: "Last name can't have special characters or number",
        min: "Last name must have at least 1 character",
        empty: "Last name is empty",
        required: "Last is required"
    },
    gender: {
        only: "Gender must be one of 'male', 'female', 'other'",
        empty: "Gender is empty",
        required: "Gender is required"
    },
    dateOfBirth: {
        format: "Date of birth must be YYYY-MM-DD",
        empty: "Date of birth is empty",
        required: "Date is required",
        max: "Date of birth cannot be in the future",
        min: "Date of birth must be in or less 100 years",
        base: "Invalid date of birth format"
    },
    role: {
        only: "Role must be one of 'manager', 'admin' or 'customer",
        empty: "Role is empty",
        required: "Role is required"
    }
}

const restaurantSchema = {
    email: joi.string().email({ minDomainSegments: 2 }).messages({
        'string.email': messages.email.email,
        'string.empty': messages.email.empty,
        'any.required': messages.email.required
    }),

    phone: joi.string().regex(/^\d{10}$/).messages({
        'string.pattern.base': messages.phone.pattern,
        'string.empty': messages.phone.empty,
        'any.required': messages.phone.required
    }),

    password: joi.string().min(8).max(12).messages({
        'string.empty': messages.password.empty,
        'string.min': messages.password.only,
        'string.max': messages.password.only,
        'any.required': messages.password.required
    }),

    firstName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        'string.min': messages.firstName.min,
        'string.pattern.base': messages.firstName.pattern,
        'string.empty': messages.firstName.empty,
        'any.required': messages.firstName.required
    }),

    lastName: joi.string().regex(/^[a-zA-Z]+$/).min(2).messages({
        'string.min': messages.lastName.min,
        'string.pattern.base': messages.lastName.pattern,
        'string.empty': messages.lastName.empty,
        'any.required': messages.lastName.required
    }),

    gender: joi.string().valid('male', 'female', 'other').messages({
        'any.only': messages.gender.only,
        'any.empty': messages.gender.empty,
        'any.required': messages.gender.required
    }),

    dateOfBirth: joi.date().iso().max('now').min(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000).messages({
        'any.required': messages.dateOfBirth.required,
        'date.format': messages.dateOfBirth.format,
        'date.max': messages.dateOfBirth.max,
        'date.min': messages.dateOfBirth.min
    }),

    role: joi.string().valid('manager', 'admin', 'customer').messages({
        'any.empty': messages.role.empty,
        'any.required': messages.role.required,
        'any.only': messages.role.only,
    }),
}



const restaurantValidate = {
    register: joi.object({
        email: restaurantSchema.email.required(),
        phone: restaurantSchema.phone.required(),
        password: restaurantSchema.password.required(),
        firstName: restaurantSchema.firstName.required(),
        lastName: restaurantSchema.lastName.required(),
        gender: restaurantSchema.gender.required()
    }),

    login: joi.object({
        email: restaurantSchema.email.required(),
        password: restaurantSchema.password.required(),
    }),

    update: joi.object({
        password: restaurantSchema.password,
        newPassword: restaurantSchema.password,
        firstName: restaurantSchema.firstName,
        lastName: restaurantSchema.lastName,
        gender: restaurantSchema.gender,
        dateOfBirth: restaurantSchema.dateOfBirth,
    }),

    changeRole: joi.object({
        role: restaurantSchema.role.required()
    }),

    resetPassword: joi.object({
        newPassword: restaurantSchema.password.required()
    })

}

export default restaurantValidate