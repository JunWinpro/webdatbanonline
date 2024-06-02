import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const bookingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        table: {
            numberOfTable: {
                type: Number,
                required: () => {
                    return !this.table.tableList || this.table.tableList.length === 0;
                }
            },
            tableList: {
                type: [{
                    type: String
                }],
                validate: {
                    validator: (v) => {
                        return v.length > 0 || this.table.numberOfTable;
                    },
                    message: "At least one of numberOfTable or tableList must be provided"
                }
            }
        },
        menu: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.MENUS,
        }],
        checkinTime: Date,
        isCheckin: {
            type: Boolean,
            default: false,
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