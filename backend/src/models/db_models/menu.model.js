import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const menuSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        image: {
            type: String,
            default: null
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["food", "drink"],
            required: true
        },
        unit: {
            type: String,
            enum: ["plate", "cup"],
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discount: {
            type: Number,
            min: 0
        },
        numberOfSold: {
            type: Number,
            default: 0
        },
        isSelling: {
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
const MenuModel = mongoose.model(collection.MENUS, menuSchema)
export default MenuModel