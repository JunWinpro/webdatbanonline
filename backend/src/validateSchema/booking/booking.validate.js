import joi from 'joi'
import messages from "./messages.js";




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
        const setValue = new Set(value)
        if (setValue.size !== value.length) return helpers.message("Table number must be unique")
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
        note: joi.string().regex(/^[A-Za-z0-9 ]+$/).messages({
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
    userBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId,
        table: bookingSchema.table,
        numberOfTable: bookingSchema.numberOfTable,
        menu: bookingSchema.menu,
        checkinTime: bookingSchema.checkinTime.required()
    }).xor('table', 'numberOfTable').messages({
        "array.includesRequiredUnknowns": "Table or number of table is required"
    }),

    employeeBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId,
        table: bookingSchema.table,
        menu: bookingSchema.menu,
        checkinTime: bookingSchema.checkinTime.required()
    })
    ,
    updateBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId.required(),
        table: bookingSchema.table,
        menu: bookingSchema.menu,
        checkinTime: bookingSchema.checkinTime
    }),
}

export default bookingValidate