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
    info: joi.array().items(joi.object({
        menu: joi.array().items(joi.object({
            menuItem: joi.string().hex().length(24).messages({
                ...messages.menu.menuItem
            }).required(),
            quantity: joi.number().integer().min(1).messages({
                ...messages.menu.quantity
            }).required(),
            note: joi.string().regex(/^[A-Za-z0-9 ]+$/).messages({
                ...messages.menu.note
            })
        })),
        tableNumber: joi.number().integer().min(1).required()
    })).custom((value, helpers) => {
        const setValue = new Set(value.map(item => item.tableNumber))
        if (setValue.size !== value.length) return helpers.message("Table number must be unique")
        return value.sort((a, b) => a.tableNumber - b.tableNumber)
    }),

    note: joi.string().regex(/^[A-Za-z0-9 ]+$/).messages({
        ...messages.menu.note
    }),

    checkinTime: joi.number().min(Date.now()).max(Date.now() + 3 * 86400000).integer().messages({
        ...messages.checkinTime
    }),
}
const bookingQuerySchema = {
    restaurantId: joi.string().hex().length(24).messages({
        ...messages.restaurantId
    }),
    status: joi.string().valid('cancel', 'accepted', 'rejected', 'cancelled').messages({
        ...messages.status
    }),
    checkinTime: joi.number().min(Date.now()).max(Date.now() + 3 * 86400000).integer().messages({
        ...messages.checkinTime
    }),
    page: joi.number().integer().min(1),
    pageSize: joi.number().integer().min(1).max(36),
    tableNumber: joi.number().integer().min(1)
}

const bookingValidate = {
    createBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        restaurantId: bookingSchema.restaurantId.required(),
        info: bookingSchema.info,
        notes: bookingSchema.note,
        checkinTime: bookingSchema.checkinTime.required()
    }),
    getBookings: joi.object(bookingQuerySchema),

    updateBooking: joi.object({
        firstName: bookingSchema.firstName,
        lastName: bookingSchema.lastName,
        phone: bookingSchema.phone,
        info: bookingSchema.info,
        restaurantId: bookingSchema.restaurantId.required(),
    }),
}

export default bookingValidate