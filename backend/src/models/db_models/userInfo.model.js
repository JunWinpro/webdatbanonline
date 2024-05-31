import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const userInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.USERS,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    address: {
        streetAddress: String,
        city: String,
    }
},
    {
        timestamps: true
    }
)
const UserInfoModel = mongoose.model(collection.USER_INFORMATION, userInfoSchema)
export default UserInfoModel