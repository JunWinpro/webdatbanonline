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
        reviewImageUrls: [{
            type: String,
            default: null
        }],
        rate: {
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