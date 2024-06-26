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
        minPrice: {
            type: Number,
            default: null
        },
        maxPrice: {
            type: Number,
            default: null
        },
        rating: {
            type: Number,
            default: null,
            min: 1,
            max: 5
        },
        isOpening: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        numberOfTablesBookedInLastWeek: {
            type: Number,
            default: 0
        },

    },
    {
        timestamps: true
    }
)
const RestaurantModel = mongoose.model(collection.RESTAURANTS, restaurant)
export default RestaurantModel