import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const billSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        checkedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.EMPLOYEES,
            required: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
        },
        billMenu: [{
            menu: {
                type: mongoose.Schema.Types.ObjectId,
                ref: collection.MENUS,
                required: true
            },
            totalUnit: {
                type: Number,
                required: true,
            },
            lastPrice: {
                type: Number,
                required: true
            },
        }],
        paymentMethod: {
            type: String,
            enum: ["transfer", "cash"],
            required: true
        },
        payer: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        },
        tableId: {
            type: String,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
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
const BillModel = mongoose.model(collection.BILLS, billSchema)
export default BillModel