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
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            default: null
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "other"]
        },
        address: {
            streetAddress: {
                type: String,
                default: null
            },
            district: {
                type: String,
                default: null
            },
            city: {
                type: String,
                default: null
            },
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
        veryficationToken: {
            type: String,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        resetPassworken: {
            type: String,
            default: null
        },
        resetPasswordExpireIn: {
            type: Number,
            default: null
        },
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model(collection.USERS, userSchema)
export default UserModel

