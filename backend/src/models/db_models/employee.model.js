import mongoose from "mongoose";
import { collection } from "../../database/collection.js";

const employeeSchema = new mongoose.Schema(
    {
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
            type: String,
            required: true
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
        resetPasswordToken: String,
        resetPasswordExpireIn: Number
    },
    {
        timestamps: true
    }
)

const EmployeeModel = mongoose.model(collection.EMPLOYEES, employeeSchema)

export default EmployeeModel