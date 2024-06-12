import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const restaurantInfo = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        employee: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.EMPLOYEES,
            default: null
        }],
        maxim: {
            type: String,
            default: null
        },
        description: [{
            title: {
                type: String,
                default: null
            },
            content: {
                type: String,
                default: null
            },
        }],
        schedule: [{
            dayOfWeek: {
                type: Number,
                required: true
            },
            isWorkingDay: {
                type: Boolean,
                required: true
            },
            openTime: {
                type: Number,
                required: true
            },
            closeTime: {
                type: Number,
                required: true
            },
        }],
        foodImages: [{
            type: String,
            default: null
        }],
        menuImages: [{
            type: String,
            default: null
        }],
        restaurantImages: [{
            type: String,
            default: null
        }],
    },
    {
        timestamps: true
    }
)
const RestaurantInfoModel = mongoose.model(collection.RESTAURANT_INFORMATION, restaurantInfo)
export default RestaurantInfoModel