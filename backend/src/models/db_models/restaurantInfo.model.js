import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const descriptionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: null
        },
        content: {
            type: String,
            default: null
        }
    },
    {
        _id: false
    }
)

const scheduleSchema = new mongoose.Schema(
    {
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
        }
    },
    {
        _id: false
    }
)

const restaurantInfo = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        maxim: {
            type: String,
            default: null
        },
        description: [descriptionSchema],
        schedule: [scheduleSchema],
        totalTable: Number,
        foodImages: [{
            type: String,
            default: []
        }],
        menuImages: [{
            type: String,
            default: []
        }],
        restaurantImages: [{
            type: String,
            default: []
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