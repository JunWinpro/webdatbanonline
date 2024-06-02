import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const restaurant = new mongoose.Schema(
    {
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.USERS,
            required: true
        },
        name: {
            type: String,
            unique: true,
            required: true
        },
        address: {
            streetAddress: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },
        avatar: String,
        category: [{
            type: String,
            required: true
        }],
        rating: {
            type: Number,
            default: 0,
            min: 1,
            max: 5
        },
        isOpening: Boolean,
        isActive: Boolean,
        tableList: [{
            tableId: {
                type: String,
                required: true
            },
            isEmpty: {
                type: Boolean,
                required: true
            },
        }],
        isDeleted: {
            type: Boolean,
            default: false
        }
        // Number table booking in 1 week
    },
    {
        timestamps: true
    }
)
const RestaurantModel = mongoose.model(collection.RESTAURANTS, restaurant)
export default RestaurantModel