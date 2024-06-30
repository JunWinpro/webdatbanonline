import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const menuSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.MENUS
    },
    numberOfUnit: Number,
    note: String
},
    {
        _id: false
    })

const bookingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: String,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        table: [Number],
        numberOfTable: Number,
        menu: [menuSchema],
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