import joi from 'joi';
const billSchema = {
    bookingId: joi.string().hex().length(24),
    restaurantId: joi.string().hex().length(24),
    paymentMethod: joi.string().valid('cash', 'transfer')
}

const billValidate = {
    createBill: joi.object({
        bookingId: billSchema.bookingId.required(),
        restaurantId: billSchema.restaurantId.required(),
        paymentMethod: billSchema.paymentMethod.required()
    })
}

export default billValidate;