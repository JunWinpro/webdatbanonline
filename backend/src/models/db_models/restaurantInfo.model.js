import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const restaurantInfo = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        employees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.EMPLOYEES
        }],
        maxim: {
            type: String,
            default: ""
        },
        description: [{
            title: {
                type: String,
                default: ""
            },
            content: {
                type: String,
                default: ""
            },
        }],
        schedule: [{
            dayOfWeek: {
                type: Number,
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
            breakTime: {
                type: Number,
                required: true
            },
        }],
        foodImageUrls: [{
            type: String,
            default: ""
        }],
        menuImageUrls: [{
            type: String,
            default: ""
        }],
        restaurantImageUrls: [{
            type: String,
            default: ""
        }],
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)
const RestaurantInfoModel = mongoose.model(collection.RESTAURANT_INFORMATION, restaurantInfo)
export default RestaurantInfoModel