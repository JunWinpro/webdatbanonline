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
            district: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },
        avatar: {
            type: String,
            default: null,
        },
        category: [{
            type: String,
            required: true
        }],
        rating: {
            type: Number,
            default: null,
            min: 1,
            max: 5
        },
        tableList: [{
            tableId: {
                type: Number,
                required: true
            },
            isEmpty: {
                type: Boolean,
                default: true
            },
        }],
        isOpening: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
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