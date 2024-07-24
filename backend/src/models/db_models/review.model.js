import mongoose from "mongoose";
import { collection } from "../../database/collection.js";

const reviewSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.USERS,
            required: true
        },
        title: {
            type: String,
            default: null
        },
        content: {
            type: String,
            default: null
        },
        reviewImages: [{
            type: String,
            default: null
        }],
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: collection.RESTAURANTS
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
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

const ReviewModel = mongoose.model(collection.REVIEWS, reviewSchema);
export default ReviewModel;