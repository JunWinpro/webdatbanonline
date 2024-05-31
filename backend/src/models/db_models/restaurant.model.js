import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const restaurant = new mongoose.Schema({
    manager: {
        type: mongoose.Schema.Types.ObjectId,
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
        min: 1,
        max: 5
    },
    isOpening: Boolean,
    isActive: Boolean,
    tableList: [{
        id: String,
        isEmpty: Boolean,
        required: true
    }],
    // Number table booking in 1 week
},
    {
        timestamps: true
    }
)
const RestaurantModel = mongoose.model(collection.RESTAURANTS, restaurant)
export default RestaurantModel