import mongoose from "mongoose"
import { collection } from "../../database/collection.js"

const menuSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.MENUS,
    },
    quantity: {
        type: Number,
    },
    note: {
        type: String,
    },
}, {
    _id: false,
})

const infoSchema = new mongoose.Schema({
    menu: [menuSchema],
    tableNumber: {
        type: Number,
        required: true
    },
}, {
    _id: false
})

const bookingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            default: null
        },
        lastName: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        note: {
            type: String,
            default: null
        },
        info: [infoSchema],
        checkinTime: {
            type: Number,
            required: true
        },
        isCheckin: {
            type: Boolean,
            default: false
        },
        isFinished: {
            type: Boolean,
            default: false
        },
        isCanceled: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const BookingModel = mongoose.model(collection.BOOKINGS, bookingSchema)
export default BookingModel