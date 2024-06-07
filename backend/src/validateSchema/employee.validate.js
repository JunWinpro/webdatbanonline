import joi from "joi";
const messages = {
    username: {
        alphanum: "Username cannot contain spaces or special characters",
        min: "Username length must be from 5 to 10",
        max: "Username length must be from 5 to 10",
        empty: "Username is empty",
        required: "Username is required"
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
}

const employeeSchema = {
    username: joi.string().alphanum().min(5).max(10).messages({
        'string.alphanum': messages.username.alphanum,
        'string.min': messages.username.min,
        'string.max': messages.username.max,
        'string.empty': messages.username.empty,
        'any.required': messages.username.required
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


    // update: joi.object({
    //     password: employeeSchema.password,
    //     newPassword: employeeSchema.password,
    //     firstName: employeeSchema.firstName,
    //     lastName: employeeSchema.lastName,
    //     gender: employeeSchema.gender,
    //     dateOfBirth: employeeSchema.dateOfBirth,
    // }),

    // resetPassword: joi.object({
    //     newPassword: employeeSchema.password.required()
    // }),

    // forgetPassword: joi.object({
    //     email: employeeSchema.email.required()
    // })

}

export default employeeValidate