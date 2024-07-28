import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const menuItemSchema = new mongoose.Schema({
    code: String,
    name: String,
    type: String,
    unit: String,
    price: Number,
    discount: Number,
}, {
    _id: false,
})
const menuSchema = new mongoose.Schema({
    menuItem: menuItemSchema,
    quantity: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: null
    },
    total: {
        type: Number,
        required: true
    }
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
const billSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["transfer", "cash"],
            required: true
        },
        payer: {
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
            }
        },
        info: [infoSchema],
        totalPrice: {
            type: Number,
            required: true
        },
        checkinTime: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const BillModel = mongoose.model(collection.BILLS, billSchema)
export default BillModel