import joi from "joi";
const messages = {
    email: {
        email: "Email must have at least 2 domain segments example: example.com",
        empty: "Email is empty",
        required: "Email is required"
    },
    phone: {
        pattern: "Phone must be 10 numbers",
        empty: "Phone is empty",
        required: "Phone is required"
    },
    password: {
        only: "Password must be from 8 to 12 characters",
        empty: "Password is empty",
        required: "Password is required"
    },
    firstName: {
        pattern: "First name cannot contain spaces or special characters or number",
        min: "First name must have at least 1 character",
        empty: "First name  is empty",
        required: "First name is required"
    },
    lastName: {
        pattern: "Last name cannot contain spaces or special characters or number",
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
    address: {
        streetAddress: {
            empty: 'Street address is empty'
        },
        city: {
            empty: 'City is empty'
        },
    },
    role: {
        only: "Role must be one of 'manager', 'admin' or 'customer",
        empty: "Role is empty",
        required: "Role is required"
    }
}

const userSchema = {
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

    address: {
        streetAddress: joi.string().messages({
            'string.empty': messages.address.streetAddress.empty,
        }),
        city: joi.string().messages({
            'string.empty': messages.address.city.empty,
        }),
    },

    role: joi.string().valid('manager', 'admin', 'customer').messages({
        'any.empty': messages.role.empty,
        'any.required': messages.role.required,
        'any.only': messages.role.only,
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
        newPassword: userSchema.password,
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        gender: userSchema.gender,
        dateOfBirth: userSchema.dateOfBirth,
    }),

    changeRole: joi.object({
        role: userSchema.role.required()
    }),

    resetPassword: joi.object({
        newPassword: userSchema.password.required()
    }),

    forgetPassword: joi.object({
        email: userSchema.email.required()
    })

}

export default userValidate