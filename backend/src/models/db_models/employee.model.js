import mongoose from "mongoose";
import { collection } from "../../database/collection.js";

const employeeSchema = new mongoose.Schema(
    {
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.USERS,
            required: true
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.RESTAURANTS,
            required: true
        },
        username: {
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
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        employeeId: {
            prefix: {
                type: String,
                default: "TTP",
                enum: ["TTP"],
            },
            suffix: {
                type: Number,
                required: true
            }
        },
        role: {
            type: String,
            default: "employee",
            enum: ['employee']
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

const EmployeeModel = mongoose.model(collection.EMPLOYEES, employeeSchema)

export default EmployeeModel