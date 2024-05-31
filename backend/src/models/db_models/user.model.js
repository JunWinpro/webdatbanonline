import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "manager", "admin"]
    },
    resetPasswordToken: String,
    resetPasswordExpireIn: Number
},
    {
        timestamps: true
    }
)
const UserModel = mongoose.model(collection.USERS, userSchema)
export default UserModel