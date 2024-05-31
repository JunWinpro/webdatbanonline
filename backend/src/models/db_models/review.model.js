import mongoose from "mongoose";
import { collection } from "../../database/collection";

const reviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.USERS,
        required: true
    },
    title: {
        type: String,
    },
    content: {
        type: String
    },
    reviewImageUrls: [String],
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
},
    {
        timestamps: true
    }
)

const ReviewModel = mongoose.model(collection.REVIEWS, reviewSchema);
export default ReviewModel;