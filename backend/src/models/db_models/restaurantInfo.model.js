import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const restaurantInfo = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.RESTAURANTS,
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.EMPLOYEES
    }],
    maxim: String,
    description: [{
        title: String,
        content: String,
        required: true
    }],
    schedule: [{
        dayOfWeek: Number,
        openTime: Number,
        closeTime: Number,
        breakTime: Number,
        required: true

    }],
    foodImageUrls: [String],
    menuImageUrls: [String],
    restaurantImageUrls: [String],
},
    {
        timestamps: true
    }
)
const RestaurantInfoModel = mongoose.model(collection.RESTAURANT_INFORMATION, restaurantInfo)
export default RestaurantInfoModel