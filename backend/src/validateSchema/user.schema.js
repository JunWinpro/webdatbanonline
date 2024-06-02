import joi from "joi";

const userSchema = {
    email: joi.string().email({ minDomainSegments: 2 }).message(
        "Email must have at least 2 domain segments"
    ),
    phone: joi.string().regex(/^\d{10}$/).message("Phone must be 10 numbers"),
    password: joi.string().min(8).max(12).required().message("Password must be from 8 to 12 characters"),
    firstName: joi.string().min(1).required(),
    lastName: joi.string().min(2).required(),
    gender: joi.string().valid('male', 'female', 'other').required(),
    dateOfBirth: {
        day: joi.number().greater(0).less(32),
        month: joi.number().greater(0).less(13),
        year: joi.number().greater(1865).less(new Date().getFullYear())
    }
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
        email: userSchema.email,
        phone: userSchema.phone,
        password: userSchema.password.required(),
    }).or('email', 'phone'),

    update: joi.object({
        password: userSchema.password,
        newPassword: userSchema.password,
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        gender: userSchema.gender,
        dateOfBirth: {
            day: userSchema.dateOfBirth.day,
            month: userSchema.dateOfBirth.month,
            year: userSchema.dateOfBirth.year
        }
    })

}

export default userValidate