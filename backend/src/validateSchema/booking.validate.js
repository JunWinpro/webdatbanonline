import joi from 'joi'
const messages = {
    phone: {
        'string.pattern.base': "Phone must be 10 numbers",
        'string.empty': "Phone is empty",
        'any.required': "Phone is required"
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
    restaurantId: {
        'string.hex': "Restaurant id must be a valid ObjectId",
        'string.empty': 'Restaurant id is empty',
        'any.required': 'Restaurant id is required'
    },
    table: {
        'number.base': "Table ID must be a number",
        'number.min': "Table ID must be greater than 0",
        'number.empty': "Table ID can't be empty"
    },
    numberOfTable: {
        'number.base': "Number of table must be a number",
        'number.min': "Number of table must be greater than 0",
        'number.empty': "Number of table can't be empty"
    },

    menu: {
        menuItem: {
            'string.hex': "Menu item must be a valid ObjectId",
            'string.empty': 'Menu item is empty',
            'any.required': 'Menu item is required'
        },
        numberOfUnit: {
            'number.base': "Number of unit must be a number",
            'number.min': "Number of unit must be greater than 0",
            'number.empty': "Number of unit can't be empty",
            'any.required': "Number of unit is required"
        },
        menu: {
            'array.base': "Menu must be an array",
            'array.empty': "Menu can't be empty",
            'any.required': "Menu is required"
        },

        note: {
            'string.base': "Note must be a string",
            'string.empty': "Note can't be empty",
        }
    },

    checkinTime: {
        'number.base': "Checkin time must be a number",
        'number.min': "Checkin time must be greater than 0",
        'number.empty': "Checkin time can't be empty",
        'any.required': "Checkin time is required",
        'number.integer': "Checkin time must be an integer",
        'number.min': "Checkin time must be greater than current time",
        'number.max': "Checkin time must be less than 14 days"
    }
}

const bookingSchema = {
    restaurantId: joi.string().hex().length(24).messages({
        ...messages.restaurantId
    }),
    firstName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.firstName
    }),

    lastName: joi.string().regex(/^[a-zA-Z]+$/).min(1).messages({
        ...messages.lastName
    }),
    phone: joi.string().regex(/^\d{10}$/).messages({
        ...messages.phone
    }),
    restaurantId: joi.string().hex().length(24).messages({
        ...messages.restaurantId
    }),
    table: joi.array().items(joi.number().integer().min(1).required().messages({
        ...messages.table
    })).messages({
        'array.base': "Table is an array of table number"
    }).custom((value, helpers) => {
        if (new Set(value) !== value.length) return helpers.message("Table number must be unique")
        return value.sort((a, b) => a - b)
    }),

    numberOfTable: joi.number().integer().min(1).messages({
        ...messages.numberOfTable
    }),

    menu: joi.array().items(joi.object({
        menuItem: joi.string().hex().length(24).messages({
            ...messages.menu.menuItem
        }),
        numberOfUnit: joi.number().integer().min(1).messages({
            ...messages.menu.numberOfUnit
        }),
        note: joi.string().regex().messages({
            ...messages.menu.note
        })
    })).messages({
        ...messages.menu.menu
    }),

    checkinTime: joi.number().min(Date.now()).max(Date.now() + 14 * 86400000).integer().messages({
        ...messages.checkinTime
    }),
}

const bookingValidate = {
    createBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId,
        table: bookingSchema.table,
        numberOfTable: bookingSchema.numberOfTable,
        menu: bookingSchema.menu,
        checkinTime: bookingSchema.checkinTime.required()
    }).xor('table', 'numberOfTable'),

    updateBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId,
        table: bookingSchema.table,
        numberOfTable: bookingSchema.numberOfTable,
        menu: bookingSchema.menu,
        checkinTime: bookingSchema.checkinTime.required()
    }).xor('table', 'numberOfTable'),
}

export default bookingValidate