import mongoose from "mongoose"
import { collection } from "../../database/collection.js"
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        phone: {
            type: Number,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: String,
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            day: Number,
            month: String,
            year: Number
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "other"]
        },
        address: {
            streetAddress: String,
            city: String,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "manager", "admin"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordExpireIn: Number,
    },
    {
        timestamps: true
    }
)
const UserModel = mongoose.model(collection.USERS, userSchema)
export default UserModel

